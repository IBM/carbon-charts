import { storiesOf, moduleMetadata } from "@storybook/angular";
import { CircleModule } from "./circle.module";
import { ScreenModule } from "@carbon/icons-angular";

const getTemplate = demo => `
	<div class="container theme--white">
		${demo}
	</div>
`;

storiesOf("Experimental|Circle", module)
.addDecorator(
	moduleMetadata({
		imports: [CircleModule, ScreenModule]
	})
)
.add("Default", () => ({
	template: getTemplate(`
		<div style="height: 48px; width: 48px">
			<ibm-graph-circle [title]="title" [renderIcon]="iconTemplate"></ibm-graph-circle>
			<ng-template #iconTemplate>
				<svg ibmIconScreen size="20"></svg>
			</ng-template>
		</div>
	`),
	props: {
		title: "Title",
	},
}))
;
