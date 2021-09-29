import Edit from './edit';
import UserDefine from './userDefine';
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

test('Edit', () => {
    const { asFragment } = render(<Edit />);
    expect(asFragment()).toMatchSnapshot();
});

test('UserDefine', () => {
    const { asFragment } = render(<UserDefine />);
    expect(asFragment()).toMatchSnapshot();
});
