// Internal Imports
import { Component } from "@carbon/charts/src/components/component";

import mapboxgl from "mapbox-gl";

import L from "leaflet";

window["L"] = L;

import "leaflet.markercluster";

// import * as Hello from "mapbox-gl-leaflet";

L.MapboxGL = L.Layer.extend({
	options: {
		updateInterval: 32,
		// How much to extend the overlay view (relative to map size)
		// e.g. 0.1 would be 10% of map view in each direction
		padding: 0.1,
		// whether or not to register the mouse and keyboard
		// events on the mapbox overlay
		interactive: false
	},

	initialize: function (options) {
		L.setOptions(this, options);

		if (options.accessToken) {
			mapboxgl.accessToken = options.accessToken;
		} else {
			throw new Error("You should provide a Mapbox GL access token as a token option.");
		}

		// setup throttling the update event when panning
		this._throttledUpdate = L.Util.throttle(this._update, this.options.updateInterval, this);
	},

	onAdd: function (map) {
		if (!this._container) {
			this._initContainer();
		}

		map.getPanes().tilePane.appendChild(this._container);

		this._initGL();

		this._offset = this._map.containerPointToLayerPoint([0, 0]);

		// work around https://github.com/mapbox/mapbox-gl-leaflet/issues/47
		if (map.options.zoomAnimation) {
			L.DomEvent.on(map._proxy, L.DomUtil.TRANSITION_END, this._transitionEnd, this);
		}
	},

	onRemove: function (map) {
		if (this._map._proxy && this._map.options.zoomAnimation) {
			L.DomEvent.off(this._map._proxy, L.DomUtil.TRANSITION_END, this._transitionEnd, this);
		}

		map.getPanes().tilePane.removeChild(this._container);
		this._glMap.remove();
		this._glMap = null;
	},

	getEvents: function () {
		return {
			move: this._throttledUpdate, // sensibly throttle updating while panning
			zoomanim: this._animateZoom, // applys the zoom animation to the <canvas>
			zoom: this._pinchZoom, // animate every zoom event for smoother pinch-zooming
			zoomstart: this._zoomStart, // flag starting a zoom to disable panning
			zoomend: this._zoomEnd
		};
	},

	getMapboxMap: function () {
		return this._glMap;
	},

	getCanvas: function () {
		return this._glMap.getCanvas();
	},

	getSize: function () {
		return this._map.getSize().multiplyBy(1 + this.options.padding * 2);
	},

	getBounds: function () {
		const halfSize = this.getSize().multiplyBy(0.5);
		const center = this._map.latLngToContainerPoint(this._map.getCenter());
		return L.latLngBounds(
			this._map.containerPointToLatLng(center.subtract(halfSize)),
			this._map.containerPointToLatLng(center.add(halfSize))
		);
	},

	getContainer: function () {
		return this._container;
	},

	_initContainer: function () {
		const container = this._container = L.DomUtil.create("div", "leaflet-gl-layer");

		const size = this.getSize();
		const offset = this._map.getSize().multiplyBy(this.options.padding);
		container.style.width = size.x + "px";
		container.style.height = size.y + "px";

		const topLeft = this._map.containerPointToLayerPoint([0, 0]).subtract(offset);

		L.DomUtil.setPosition(container, topLeft);
	},

	_initGL: function () {
		const center = this._map.getCenter();

		const options = L.extend({}, this.options, {
			container: this._container,
			center: [center.lng, center.lat],
			zoom: this._map.getZoom() - 1,
			attributionControl: false
		});

		this._glMap = new mapboxgl.Map(options);

		// allow GL base map to pan beyond min/max latitudes
		this._glMap.transform.latRange = null;

		if (this._glMap._canvas.canvas) {
			// older versions of mapbox-gl surfaced the canvas differently
			this._glMap._actualCanvas = this._glMap._canvas.canvas;
		} else {
			this._glMap._actualCanvas = this._glMap._canvas;
		}

		// treat child <canvas> element like L.ImageOverlay
		const canvas = this._glMap._actualCanvas;
		L.DomUtil.addClass(canvas, "leaflet-image-layer");
		L.DomUtil.addClass(canvas, "leaflet-zoom-animated");
		if (this.options.interactive) {
			L.DomUtil.addClass(canvas, "leaflet-interactive");
		}
		if (this.options.className) {
			L.DomUtil.addClass(canvas, this.options.className);
		}
	},

	_update: function (e) {
		// update the offset so we can correct for it later when we zoom
		this._offset = this._map.containerPointToLayerPoint([0, 0]);

		if (this._zooming) {
			return;
		}

		const size = this.getSize(),
			container = this._container,
			gl = this._glMap,
			offset = this._map.getSize().multiplyBy(this.options.padding),
			topLeft = this._map.containerPointToLayerPoint([0, 0]).subtract(offset);

		L.DomUtil.setPosition(container, topLeft);

		const center = this._map.getCenter();

		// gl.setView([center.lat, center.lng], this._map.getZoom() - 1, 0);
		// calling setView directly causes sync issues because it uses requestAnimFrame

		const tr = gl.transform;
		tr.center = mapboxgl.LngLat.convert([center.lng, center.lat]);
		tr.zoom = this._map.getZoom() - 1;

		if (gl.transform.width !== size.x || gl.transform.height !== size.y) {
			container.style.width = size.x + "px";
			container.style.height = size.y + "px";
			if (gl._resize !== null && gl._resize !== undefined) {
				gl._resize();
			} else {
				gl.resize();
			}
		} else {
			// older versions of mapbox-gl surfaced update publicly
			if (gl._update !== null && gl._update !== undefined) {
				gl._update();
			} else {
				gl.update();
			}
		}
	},

	// update the map constantly during a pinch zoom
	_pinchZoom: function (e) {
		this._glMap.jumpTo({
			zoom: this._map.getZoom() - 1,
			center: this._map.getCenter()
		});
	},

	// borrowed from L.ImageOverlay
	// https://github.com/Leaflet/Leaflet/blob/master/src/layer/ImageOverlay.js#L139-L144
	_animateZoom: function (e) {
		const scale = this._map.getZoomScale(e.zoom);
		const padding = this._map.getSize().multiplyBy(this.options.padding * scale);
		const viewHalf = this.getSize()._divideBy(2);
		// corrections for padding (scaled), adapted from
		// https://github.com/Leaflet/Leaflet/blob/master/src/map/Map.js#L1490-L1508
		const topLeft = this._map.project(e.center, e.zoom)
			._subtract(viewHalf)
			._add(this._map._getMapPanePos()
				.add(padding))._round();
		const offset = this._map.project(this._map.getBounds().getNorthWest(), e.zoom)
			._subtract(topLeft);

		L.DomUtil.setTransform(
			this._glMap._actualCanvas,
			offset.subtract(this._offset),
			scale
		);
	},

	_zoomStart: function (e) {
		this._zooming = true;
	},

	_zoomEnd: function () {
		const scale = this._map.getZoomScale(this._map.getZoom()),
			offset = this._map._latLngToNewLayerPoint(
				this._map.getBounds().getNorthWest(),
				this._map.getZoom(),
				this._map.getCenter()
			);

		L.DomUtil.setTransform(
			this._glMap._actualCanvas,
			offset.subtract(this._offset),
			scale
		);

		this._zooming = false;

		this._update();

		console.log("position", this._map.getCenter());
	},

	_transitionEnd: function (e) {
		L.Util.requestAnimFrame(function () {
			const zoom = this._map.getZoom();
			const center = this._map.getCenter();
			const offset = this._map.latLngToContainerPoint(
				this._map.getBounds().getNorthWest()
			);

			// reset the scale and offset
			L.DomUtil.setTransform(this._glMap._actualCanvas, offset, 1);

			// enable panning once the gl map is ready again
			this._glMap.once("moveend", L.Util.bind(function () {
				this._zoomEnd();
			}, this));

			// update the map position
			this._glMap.jumpTo({
				center: center,
				zoom: zoom - 1
			});
		}, this);
	}
});

L.mapboxGL = function (options) {
	return new L.MapboxGL(options);
};

// An extract of address points from the LINZ bulk extract: http://www.linz.govt.nz/survey-titles/landonline-data/landonline-bde
// Should be this data set: http://data.linz.govt.nz/#/layer/779-nz-street-address-electoral/
const addressPoints = [
	[-37.8210922667, 175.2209316333, "2"],
	[-37.8210819833, 175.2213903167, "3"],
	[-37.8210881833, 175.2215004833, "3A"],
	[-37.8211946833, 175.2213655333, "1"],
	[-37.8209458667, 175.2214051333, "5"],
	[-37.8208292333, 175.2214374833, "7"],
	[-37.8325816, 175.2238798667, "537"],
	[-37.8315855167, 175.2279767, "454"],
	[-37.8096336833, 175.2223743833, "176"],
	[-37.80970685, 175.2221815833, "178"],
	[-37.8102146667, 175.2211562833, "190"],
	[-37.8088037167, 175.2242227, "156"],
	[-37.8112330167, 175.2193425667, "210"],
	[-37.8116368667, 175.2193005167, "212"],
	[-37.80812645, 175.2255449333, "146"],
	[-37.8080231333, 175.2286383167, "125"],
	[-37.8089538667, 175.2222222333, "174"],
	[-37.8080905833, 175.2275400667, "129"],
	[-37.808811, 175.2227592833, "172"],
	[-37.80832975, 175.2276898167, "131"],
	[-37.8089395333, 175.2281710333, "133"],
	[-37.8093421, 175.2274883167, "135"],
	[-37.8084820833, 175.22601925, "137"],
	[-37.80881015, 175.22622865, "139"],
	[-37.8090947667, 175.2263585667, "141"],
	[-37.8092962333, 175.2244872333, "147"],
	[-37.8091016667, 175.2249140167, "145"],
	[-37.8088785167, 175.2253611667, "143"],
	[-37.80825965, 175.22530115, "148"],
	[-37.80995685, 175.2238554333, "153"],
	[-37.80975435, 175.2238417833, "151"],
	[-37.80950755, 175.2237912, "149"],
	[-37.8092772667, 175.2231980833, "170"],
	[-37.8082753833, 175.20672975, "4"],
	[-37.8078434833, 175.211822, "56"],
	[-37.8083775667, 175.2090812333, "30B"],
	[-37.8084588, 175.2058838167, "174"],
	[-37.8088788333, 175.2062702833, "175"],
	[-37.8091632833, 175.20514875, "182A"],
	[-37.8094891167, 175.20384695, "202"],
	[-37.8156715667, 175.2034881667, "277"],
	[-37.8109189333, 175.2024631, "220"],
	[-37.8108164333, 175.2039622, "219"],
	[-37.8125773667, 175.2026079667, "238"],
	[-37.8125799333, 175.2032824, "241A"],
	[-37.8125869, 175.2037423833, "241C"],
	[-37.8140266833, 175.2025706, "256"],
	[-37.80932, 175.2051094333, "182B"],
	[-37.8098799667, 175.2040444167, "197"],
	[-37.8094298833, 175.20561245, "189"],
	[-37.8172409333, 175.2035291167, "287"],
	[-37.8232166667, 175.22452865, "2028"],
	[-37.8225024333, 175.2249944667, "2022"],
	[-37.82334135, 175.2244748667, "2030"],
	[-37.8229725333, 175.2246809333, "2026"],
	[-37.8224034667, 175.22507345, "2020"],
	[-37.8227806, 175.2248285833, "2024"],
	[-37.8178801, 175.2181871667, "6"],
	[-37.81811315, 175.2180543667, "4"],
	[-37.8181739833, 175.21851995, "1"],
	[-37.81797515, 175.2186312, "3"],
	[-37.8181787, 175.2176995, "2A"],
	[-37.8183385333, 175.21812895, "2"],
	[-37.8293053167, 175.2105357833, "31"],
	[-37.8309444333, 175.21208735, "16"],
	[-37.8306726667, 175.2115020833, "19"],
	[-37.8300903, 175.2120791, "26"],
	[-37.8289416167, 175.2113778333, "33"],
	[-37.8274969167, 175.2113355167, "53"],
	[-37.8199192667, 175.2173622833, "5A"],
	[-37.8200392833, 175.2174100167, "3"],
	[-37.8196328, 175.2167642, "18"],
	[-37.81752585, 175.2155467667, "22C"],
	[-37.81766615, 175.2153714167, "22B"],
	[-37.8179022667, 175.2151616833, "22A"],
	[-37.8191980333, 175.21664245, "20A"],
	[-37.81799325, 175.21565925, "20C"],
	[-37.8187486333, 175.2165228667, "20B"],
	[-37.81964875, 175.2172874167, "7"],
	[-37.81925545, 175.2171617, "11"],
	[-37.8190491667, 175.2170928333, "13"],
	[-37.8194515667, 175.2172147167, "9"],
	[-37.81981045, 175.21733245, "5B"],
	[-37.81876595, 175.2172445167, "15B"],
	[-37.8185999167, 175.2172441, "17A"],
	[-37.81816745, 175.21725905, "21B"],
	[-37.8182157167, 175.2164626333, "24"],
	[-37.8180109667, 175.2173984167, "23A"],
	[-37.8179918, 175.217159, "23B"],
	[-37.8188473167, 175.2170330333, "15"],
	[-37.8186481333, 175.2169800667, "17"],
	[-37.8184132, 175.2169327333, "19"],
	[-37.8202288333, 175.2174746333, "1"],
	[-37.818193, 175.2169955667, "21"],
	[-37.8178000833, 175.21733275, "25"],
	[-37.8176839, 175.2168488333, "26"],
	[-37.8198172, 175.2204960667, "5"],
	[-37.819986, 175.22049635, "3"],
	[-37.8197666, 175.2200825, "4"],
	[-37.8193835833, 175.2191669667, "10"],
	[-37.8193426333, 175.2198626667, "11"],
	[-37.8192171667, 175.2191711, "12"],
	[-37.8192621333, 175.2196364167, "13"],
	[-37.8195289667, 175.2193943167, "8"],
	[-37.81946, 175.2201499167, "9"],
	[-37.8196037833, 175.219674, "6"],
	[-37.8194712, 175.2204032, "7A"],
	[-37.8196381, 175.2203709333, "7"],
	[-37.8200137667, 175.2201364333, "2"],
	[-37.8191725167, 175.2193772833, "14"],
	[-37.8214417333, 175.2256822167, "4"],
	[-37.8210291, 175.2259429667, "8"],
	[-37.8212328333, 175.2258132, "6"],
	[-37.8216819833, 175.2253209, "3"],
	[-37.8334697167, 175.2038651667, "326"],
	[-37.8322603667, 175.2028621167, "317"],
	[-37.8322013667, 175.2046802667, "1/341"],
	[-37.8320576167, 175.2165535833, "435"],
	[-37.8319540333, 175.20506915, "2/341"],
	[-37.8316975667, 175.2053442333, "3/341"],
	[-37.8328229833, 175.2062598, "346"],
	[-37.83161565, 175.2074915, "355"],
	[-37.83219305, 175.20629425, "347"],
	[-37.8328549, 175.2080619667, "362"],
	[-37.8321289667, 175.2084019333, "367"],
	[-37.8322225167, 175.2120427667, "397"],
	[-37.8321649, 175.21119325, "393"],
	[-37.8321458833, 175.2131246333, "407"],
	[-37.8327043833, 175.21377405, "416"],
	[-37.8321267167, 175.2144058167, "417"],
	[-37.83212555, 175.2096521333, "373"],
	[-37.8331028667, 175.20928495, "366"],
	[-37.82866875, 175.22177625, "563"],
	[-37.8295602, 175.21924335, "582"],
	[-37.8304707833, 175.2182986167, "590"],
	[-37.83086, 175.2180687667, "592"],
	[-37.8328604833, 175.2172892167, "618"],
	[-37.8342575667, 175.2168357833, "638"],
	[-37.8239713, 175.2245693667, "504"],
	[-37.8365260167, 175.2170911, "673"],
	[-37.8233928833, 175.2249669167, "492"],
	[-37.8248650167, 175.2246300833, "509"],
	[-37.8191798333, 175.2265331667, "435"],
	[-37.8143243333, 175.2310940167, "368"],
	[-37.81459255, 175.2320046, "363"],
	[-37.81127515, 175.2356499167, "311"],
	[-37.8126359667, 175.2340855167, "333"],
	[-37.8096158333, 175.2375218167, "293"],
	[-37.8315868667, 175.2177722833, "604"],
	[-37.8160177667, 175.2299268333, "391"],
	[-37.8204715667, 175.2265481833, "456"],
	[-37.8206352, 175.2265670333, "458"],
	[-37.8208412667, 175.2265323333, "460"],
	[-37.8210184333, 175.22648325, "462"],
	[-37.8212643833, 175.2270422167, "465"],
	[-37.82119945, 175.2264274333, "464"],
	[-37.82136485, 175.2263145667, "466"],
	[-37.8215261, 175.22684075, "467"],
	[-37.8215301833, 175.2262078, "468"],
	[-37.8217701667, 175.2266360167, "1/471"],
	[-37.8218376833, 175.22686725, "2/471"],
	[-37.8217084667, 175.2260839667, "472"],
	[-37.8219782333, 175.2265028333, "475"],
	[-37.8218988833, 175.2259723, "476"],
	[-37.8223939333, 175.2262447, "479"],
	[-37.8223048667, 175.2256582833, "480"],
	[-37.8226657, 175.2261230833, "481"],
	[-37.8224199, 175.2255487833, "482"],
	[-37.8229134167, 175.2259527833, "485"],
	[-37.8226937833, 175.2253693167, "486"],
	[-37.8231509667, 175.2258170333, "487"],
	[-37.82295265, 175.2252571167, "488"],
	[-37.8233779, 175.2256743833, "489"],
	[-37.8232052667, 175.2251109333, "490"],
	[-37.8236200333, 175.22553395, "493"],
	[-37.82385775, 175.2253390833, "495"],
	[-37.8203220167, 175.22650925, "454"],
	[-37.8179795333, 175.2262826, "428"],
	[-37.81038215, 175.2365298167, "303"],
	[-37.8161746667, 175.2297239833, "393"],
	[-37.8083635333, 175.233955, "294"],
	[-37.82029495, 175.2214968167, "39"],
	[-37.8204754333, 175.2247793333, "12B"],
	[-37.8205440833, 175.22344905, "23"],
	[-37.8195974333, 175.2254019333, "2"],
	[-37.8210801, 175.2237748667, "20A"],
	[-37.8209057333, 175.22389775, "18"],
	[-37.8208016833, 175.2221582833, "32"],
	[-37.8209372667, 175.2236919, "20"],
	[-37.8210586833, 175.22351925, "22B"],
	[-37.82092905, 175.2234855333, "22"],
	[-37.8208587333, 175.2231887667, "24"],
	[-37.8210241167, 175.2230882, "24B"],
	[-37.8208547833, 175.2229410667, "26"],
	[-37.8209917, 175.2228447667, "26B"],
	[-37.82097645, 175.2227176167, "28B"],
	[-37.8208099167, 175.2226765167, "28"],
	[-37.8207666833, 175.2224338833, "30"],
	[-37.8209508833, 175.2222094167, "32B"],
	[-37.82076515, 175.2219195167, "34A"],
	[-37.8207399667, 175.2218131667, "34B"],
	[-37.8203075833, 175.2240482833, "19"],
	[-37.8205368167, 175.2237746667, "21"],
	[-37.8205025833, 175.2231658, "25A"],
	[-37.820465, 175.2229733667, "27"],
	[-37.82043535, 175.2227387, "29"],
	[-37.8204582, 175.2225319667, "31"],
	[-37.82024115, 175.2224347833, "31B"],
	[-37.8203792333, 175.2222631667, "33"],
	[-37.82034095, 175.2219843, "35"],
	[-37.8201566167, 175.2219446, "35B"],
	[-37.82030575, 175.2217594333, "37"],
	[-37.8202966833, 175.2233158167, "25"],
	[-37.8192714167, 175.2253842667, "1"],
	[-37.81969695, 175.22516645, "4"],
	[-37.8194904667, 175.22468815, "5"],
	[-37.8198524333, 175.2249096667, "6"],
	[-37.8200581833, 175.2247122, "8"],
	[-37.8193447, 175.2244639667, "5C"],
	[-37.8208238, 175.2241340167, "16"],
	[-37.8193183667, 175.22515695, "1A"],
	[-37.81940575, 175.2249383333, "3"],
	[-37.8211855167, 175.2242545333, "18A"],
	[-37.8207094833, 175.22430275, "14"],
	[-37.82027725, 175.22488135, "10A"],
	[-37.8202305833, 175.2245652667, "10"],
	[-37.8205049667, 175.2244201333, "12"],
	[-37.8196320333, 175.2255586, "22"],
	[-37.8209711, 175.2250444667, "8"],
	[-37.82120665, 175.2252942833, "5"],
	[-37.8210184, 175.2254290333, "7"],
	[-37.8213430333, 175.2252086167, "3"],
	[-37.8207887833, 175.2251555667, "10"],
	[-37.82060805, 175.2257042333, "13"],
	[-37.8208330333, 175.22553905, "9"],
	[-37.8216988833, 175.2249665667, "1"],
	[-37.8215665833, 175.2246573333, "2"],
	[-37.8213729, 175.2247789333, "4"],
	[-37.8211700667, 175.2249324333, "6"],
	[-37.8205967667, 175.2252867, "12"],
	[-37.8204008833, 175.2254234667, "14"],
	[-37.82043265, 175.22582195, "15"],
	[-37.8202037333, 175.2255415833, "16"],
	[-37.8200154333, 175.2256547667, "18"],
	[-37.8197443167, 175.2256164833, "20"],
	[-37.8202814333, 175.22590955, "17"],
	[-37.8202967667, 175.21462555, "98"],
	[-37.82204485, 175.21819735, "61B"],
	[-37.8224241, 175.2179326667, "61C"],
	[-37.8215043167, 175.2227943833, "24"],
	[-37.8219082, 175.2255408167, "8"],
	[-37.8216963, 175.2240856667, "14"],
	[-37.8213418333, 175.2188135667, "55"],
	[-37.8204966333, 175.2183406333, "54A"],
	[-37.8221799833, 175.21122085, "139"],
	[-37.8217387, 175.22431625, "12"],
	[-37.8218650167, 175.2149734167, "107"],
	[-37.8214083333, 175.2220152667, "30"],
	[-37.8213738333, 175.2217301, "32"],
	[-37.8221598167, 175.2247839333, "9"],
	[-37.8216356, 175.2235610667, "18"],
	[-37.8212188167, 175.2221387333, "30B"],
	[-37.8200466667, 175.2166111, "84A"],
	[-37.8216679333, 175.2238393333, "16"],
	[-37.8211582833, 175.22031685, "34"],
	[-37.8221918667, 175.2250378333, "7"],
	[-37.8187410167, 175.2067290167, "170C"],
	[-37.8206532, 175.2170745667, "81"],
	[-37.8212348667, 175.2181024167, "67"],
	[-37.8213057667, 175.2185351167, "57"],
	[-37.8214571, 175.2145877333, "110"],
	[-37.82207085, 175.2136727167, "121"],
	[-37.82190125, 175.2123493, "130"],
	[-37.8207519667, 175.2102467333, "150"],
	[-37.8212159, 175.2096407, "159"],
	[-37.8208313833, 175.2067756, "172"],
	[-37.8214413333, 175.2222779833, "28"],
	[-37.8206921333, 175.2182549, "54"],
	[-37.82043975, 175.2181215, "56"],
	[-37.8218791, 175.2252452167, "10"],
	[-37.82029435, 175.2169818, "84"],
	[-37.8215885167, 175.22308725, "22"],
	[-37.8215897333, 175.2233113167, "20"],
	[-37.82167455, 175.2183345, "61A"],
	[-37.8217164667, 175.2179857333, "63"],
	[-37.82147385, 175.22253565, "26"],
	[-37.8206765333, 175.2160304333, "86"],
	[-37.8188941, 175.2069437, "170A"],
	[-37.8188068333, 175.2068104833, "170B"],
	[-37.8193742667, 175.2085580333, "170"],
	[-37.8214388167, 175.2200072, "45"],
	[-37.8209547167, 175.2157149167, "92"],
	[-37.82088565, 175.2164849333, "85"],
	[-37.82136235, 175.2159546667, "97"],
	[-37.8219607333, 175.2232987, "19"],
	[-37.8210501, 175.2179753833, "69"],
	[-37.8212466667, 175.2222175833, "28A"],
	[-37.8213836167, 175.22300555, "22A"],
	[-37.821339, 175.2227439167, "24A"],
	[-37.8208144333, 175.2173117167, "77"],
	[-37.8189363667, 175.2211582333, "25"],
	[-37.8196676167, 175.2209947333, "26B"],
	[-37.8194113, 175.2211991, "26"],
	[-37.81883205, 175.2209747, "27"],
	[-37.8186925833, 175.2207728833, "29"],
	[-37.8199931833, 175.2240802167, "2"],
	[-37.8191759333, 175.2208279333, "30"],
	[-37.81835395, 175.2196571667, "39"],
	[-37.8198807333, 175.2235938167, "6"],
	[-37.8194567833, 175.22349015, "7"],
	[-37.8200507833, 175.21933875, "58"],
	[-37.8197902167, 175.2182408, "59A"],
	[-37.81991635, 175.21797195, "59B"],
	[-37.8198223833, 175.2179361833, "59C"],
	[-37.8201049333, 175.2197347167, "60"],
	[-37.8199380333, 175.21836645, "61A"],
	[-37.82003775, 175.2182443833, "61B"],
	[-37.8200944167, 175.21803015, "61C"],
	[-37.8201259667, 175.2185610667, "63"],
	[-37.82026275, 175.2188001167, "65"],
	[-37.8188917833, 175.2203729333, "34"],
	[-37.8184921333, 175.2203832, "33"],
	[-37.8190387167, 175.2206181333, "32"],
	[-37.81968705, 175.2224253667, "16"],
	[-37.81981205, 175.223119, "10"],
	[-37.8193882833, 175.2229798333, "11"],
	[-37.8190901167, 175.2227829833, "13B"],
	[-37.8193593, 175.2227247833, "13"],
	[-37.81993935, 175.2226893333, "14B"],
	[-37.81842725, 175.2201474167, "35"],
	[-37.8187965833, 175.2200475333, "36"],
	[-37.8183878167, 175.2198735667, "37"],
	[-37.8188702167, 175.2196982333, "38B"],
	[-37.82027885, 175.2209890667, "82"],
	[-37.8199839667, 175.2190668, "56"],
	[-37.8187008333, 175.21973745, "38A"],
	[-37.8196820167, 175.22262455, "14"],
	[-37.8186528333, 175.2191018, "42"],
	[-37.8182912167, 175.21915535, "43"],
	[-37.81870525, 175.21945675, "40"],
	[-37.8195044333, 175.2214081833, "24"],
	[-37.81857075, 175.2205925167, "31"],
	[-37.8195656167, 175.2181396, "57"],
	[-37.8198411667, 175.2213911167, "24A"],
	[-37.8195851667, 175.2240869667, "3"],
	[-37.8192829167, 175.2239720167, "3A"],
	[-37.8193257, 175.2224725667, "15"],
	[-37.8197290167, 175.2224129833, "16A"],
	[-37.8196499333, 175.2221262667, "18"],
	[-37.8196755333, 175.2243193333, "1"],
	[-37.8192091667, 175.22166805, "21"],
	[-37.81957585, 175.22166585, "22"],
	[-37.8199106833, 175.2238436, "4"],
	[-37.81953715, 175.22372785, "5A"],
	[-37.8193377833, 175.22378105, "5"],
	[-37.8189702833, 175.2184597333, "46"],
	[-37.8185876167, 175.21821495, "47A"],
	[-37.8185706333, 175.2178869167, "47B"],
	[-37.8191945667, 175.21845965, "48"],
	[-37.8188482167, 175.2176680833, "49"],
	[-37.8194043667, 175.21852395, "50"],
	[-37.8196233333, 175.2186248333, "52"],
	[-37.81920055, 175.2179787167, "53"],
	[-37.8198255, 175.2188011167, "54"],
	[-37.8205994333, 175.2207248667, "81"],
	[-37.8193045333, 175.2222075667, "17"],
	[-37.8205621167, 175.2204520167, "79"],
	[-37.8180799333, 175.2194407, "41A"],
	[-37.8208301833, 175.2206735833, "81A"],
	[-37.8202558, 175.2206809333, "80"],
	[-37.81941275, 175.21804965, "55"],
	[-37.8190239, 175.2179808833, "51"],
	[-37.8187854, 175.2180712167, "47"],
	[-37.8187476667, 175.2186516333, "44"],
	[-37.8182977, 175.21889655, "45"],
	[-37.81831675, 175.2194069833, "41"],
	[-37.8192735167, 175.2219502167, "19"],
	[-37.8196219167, 175.22189825, "20"],
	[-37.81962665, 175.2216432667, "22A"],
	[-37.8192782833, 175.2209942, "28"],
	[-37.8208129833, 175.2209176833, "83A"],
	[-37.8206351167, 175.2209705667, "83"],
	[-37.8203109333, 175.2212402667, "84"],
	[-37.81909575, 175.22139795, "23"],
	[-37.8197787167, 175.2228814, "12"],
	[-37.8195628333, 175.21791605, "57A"],
	[-37.8198373833, 175.2233606833, "8"],
	[-37.8194342167, 175.22322975, "9"]
	];

export class Map extends Component {
	type = "title";
	activeMarker = null;

	render() {
		const map = L.map("classy-tiled-map-chart-holder", {maxZoom: 17})
			.setView([ -37.80354511753134, 175.2635192871094 ], 13);

		const gl = L.mapboxGL({
			accessToken: "pk.eyJ1IjoiaWxpYWRtIiwiYSI6ImNrNGJwM2wxdTBmdmgzZmp6Z2ppcmxnaWYifQ.-nuo76OMryoLcs2dPbGfUQ",
			style: "mapbox://styles/mapbox/streets-v9",
			attribution: "<a href='https://mapbox.com' target='_blank'>Mapbox</a>"
		}).addTo(map);

		const markers = L.markerClusterGroup();

		for (let i = 0; i < addressPoints.length; i++) {
			const a = addressPoints[i];
			const title = a[2];

			const markerIcon = L.divIcon({
				className: "marker"
			});
			const marker = L.marker(
				new L.LatLng(a[0], a[1]),
				{
					title: title,
					icon: markerIcon
				}
			);

			const self = this;
			marker.bindPopup(title)
				.on("click", function(e) {
					const markerDOMElement = e.originalEvent.target;
					markerDOMElement.classList.add("active");

					self.activeMarker = markerDOMElement;
				});
			markers.addLayer(marker);
		}

		map.addLayer(markers);

		map.on("popupclose", (e) => {
			if (this.activeMarker) {
				this.activeMarker.classList.remove("active");
			}
		});

		/*
		 *
		 * MAPBOX GL
		 *
		 */
		// mapboxgl.accessToken = "pk.eyJ1IjoiaWxpYWRtIiwiYSI6ImNrNGJwM2wxdTBmdmgzZmp6Z2ppcmxnaWYifQ.-nuo76OMryoLcs2dPbGfUQ";
		// const map = new mapboxgl.Map({
		// 	container: "classy-tiled-map-chart-holder",
		// 	style: "mapbox://styles/iliadm/ck4bsqmax0sms1cpcr7zucb8x"
		// });

		/*
		 *
		 * TANGRAM
		 *
		 */
		// const scene_url = "scene.yaml";

		// // Create Tangram as a Leaflet layer
		// const layer = Tangram.leafletLayer({
		// 	scene: scene_url,
		// 	// events: {
		// 	// 	hover: onHover,     // hover event (defined below)
		// 	// 	click: onClick      // click event (defined below)
		// 	// },
		// 	// debug: {
		// 	//     layer_stats: true // enable to collect detailed layer stats, access w/`scene.debug.layerStats()`
		// 	// },
		// 	logLevel: "debug",
		// });

		// // Create a Leaflet map
		// const map = L.map("classy-tiled-map-chart-holder", {
		// 	maxZoom: 22,
		// 	zoomSnap: 0,
		// 	keyboard: false
		// });

		// map.setZoom(12);
		// map.panTo(new L.LatLng(51.5, -0.09));

		// L.marker([51.5, -0.09]).addTo(map)
		// 	.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

		// L.circle([51.508, -0.11], 500, {
		// 	color: "red",
		// 	fillColor: "#f03",
		// 	fillOpacity: 0.5
		// }).addTo(map).bindPopup("I am a circle.");

		// L.polygon([
		// 	[51.509, -0.08],
		// 	[51.503, -0.06],
		// 	[51.51, -0.047]
		// ]).addTo(map).bindPopup("I am a polygon.");

		// layer.addTo(map);
		// layer.bringToFront();
	}
}
