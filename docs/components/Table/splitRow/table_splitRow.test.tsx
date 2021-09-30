import Basic from './basic';
import Edit from './edit';
import Children from './children';
import Expandable from './expandable';
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

test('Children', () => {
    const { asFragment } = render(<Children />);
    expect(asFragment()).toMatchSnapshot();
});

test('Expandable', () => {
    const { asFragment } = render(<Expandable />);
    expect(asFragment()).toMatchSnapshot();
});
