import Basic from './basic';
import Table from './table';
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

test('Table', () => {
    const { asFragment } = render(<Table />);
    expect(asFragment()).toMatchSnapshot();
});
