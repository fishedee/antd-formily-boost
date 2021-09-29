import Checkbox from './checkbox';
import CheckboxStrictly from './checkboxStrictly';
import Expand from './Expand';
import MultiSelect from './multiSelect';
import Select from './select';
import { render } from '@testing-library/react';
import React from 'react';
test('Checkbox', () => {
    const { asFragment } = render(<Checkbox />);
    expect(asFragment()).toMatchSnapshot();
});

test('CheckboxStrictly', () => {
    const { asFragment } = render(<CheckboxStrictly />);
    expect(asFragment()).toMatchSnapshot();
});

test('Expand', () => {
    const { asFragment } = render(<Expand />);
    expect(asFragment()).toMatchSnapshot();
});

test('MultiSelect', () => {
    const { asFragment } = render(<MultiSelect />);
    expect(asFragment()).toMatchSnapshot();
});

test('Select', () => {
    const { asFragment } = render(<Select />);
    expect(asFragment()).toMatchSnapshot();
});
