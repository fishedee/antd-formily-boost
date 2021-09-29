import Basic from './basic';
import Edit from './edit';
import Selection from './selection';

import { render } from '@testing-library/react';
import React from 'react';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => {
            return {
                matches: true,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            };
        }),
    });
});

test('Basic', () => {
    const { asFragment } = render(<Basic />);
    expect(asFragment()).toMatchSnapshot();
});

test('Edit', () => {
    const { asFragment } = render(<Edit />);
    expect(asFragment()).toMatchSnapshot();
});

test('Selection', () => {
    const { asFragment } = render(<Selection />);
    expect(asFragment()).toMatchSnapshot();
});
