import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from './card';

import { User16 } from '@carbon/icons-react';

const stories = storiesOf('Experimental|Card', module);
stories.addDecorator((story) => (
	<div className="container theme--white">{story()}</div>
));

stories.add('Default', () => (
	<Card title={'Title'} description={'Description'} />
));

stories.add('With icon', () => (
	<Card title={'Title'} description={'Description'} renderIcon={<User16 />} />
));
