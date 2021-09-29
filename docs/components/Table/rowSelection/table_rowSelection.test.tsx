import Checkbox from './checkbox';
import Radio from './radio';
import Hidden from './hidden';

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

test('Checkbox', () => {
    const { asFragment } = render(<Checkbox />);
    expect(asFragment()).toMatchSnapshot();
});

test('Radio', () => {
    const { asFragment } = render(<Radio />);
    expect(asFragment()).toMatchSnapshot();
});

test('Hidden', () => {
    const { asFragment } = render(<Hidden />);
    expect(asFragment()).toMatchSnapshot();
});
