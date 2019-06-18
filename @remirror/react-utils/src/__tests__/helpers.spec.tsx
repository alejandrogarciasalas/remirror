import { render } from '@testing-library/react';
import React from 'react';
import {
  cloneElement,
  getElementProps,
  isManagedRemirrorProvider,
  isReactDOMElement,
  isReactFragment,
  isRemirrorExtension,
  isRemirrorProvider,
  uniqueClass,
} from '../helpers';
import { RemirrorElementType, RemirrorFC } from '../types';

test('getElementProps', () => {
  const expected = { id: 'test' };
  const Element = <div {...expected} />;
  expect(getElementProps(Element)).toEqual(expected);
});

test('isReactDOMElement', () => {
  const Custom = () => <div />;
  expect(isReactDOMElement(<div />)).toBeTrue();
  expect(isReactDOMElement(<Custom />)).toBeFalse();
});

test('isReactFragment', () => {
  const Custom = () => <div />;
  expect(isReactFragment(<></>)).toBeTrue();
  expect(
    isReactFragment(
      <>
        <Custom />
      </>,
    ),
  ).toBeTrue();
  expect(isReactFragment(<Custom />)).toBeFalse();
});

test('uniqueClass', () => {
  expect(uniqueClass('1', '2')).toBe('2-1');
});

test('isRemirrorExtension', () => {
  const Custom: RemirrorFC = () => <div />;
  Custom.$$remirrorType = RemirrorElementType.Extension;
  expect(isRemirrorExtension(<Custom />)).toBeTrue();
});

test('isRemirrorProvider', () => {
  const Custom: RemirrorFC = () => <div />;
  Custom.$$remirrorType = RemirrorElementType.EditorProvider;
  expect(isRemirrorProvider(<Custom />)).toBeTrue();
});

test('isManagedRemirrorProvider', () => {
  const Custom: RemirrorFC = () => <div />;
  Custom.$$remirrorType = RemirrorElementType.ManagedEditorProvider;
  expect(isManagedRemirrorProvider(<Custom />)).toBeTrue();
});

describe('cloneElement', () => {
  it('clones flat components', () => {
    const el = (
      <div className='simple'>
        <p>simple</p>
        <p>element</p>
      </div>
    );
    const cloned = cloneElement(el, el.props);
    const elRender = render(el);
    const clonedRender = render(cloned);
    expect(elRender.baseElement.innerHTML).toEqual(clonedRender.baseElement.innerHTML);
  });

  it('clones nested components', () => {
    const el = (
      <div className='nested'>
        <p>
          simple
          <strong>
            element<em>nesting</em>
          </strong>
        </p>
      </div>
    );
    const cloned = cloneElement(el, el.props);
    const elRender = render(el);
    const clonedRender = render(cloned);
    expect(elRender.baseElement.innerHTML).toEqual(clonedRender.baseElement.innerHTML);
  });

  it('can add children', () => {
    const child = <p>Another one</p>;
    const propChild = <p>simple</p>;
    const el = <div className='children'>{propChild}</div>;
    const cloned = cloneElement(el, el.props, child);
    const childRender = render(child);
    const propChildRender = render(propChild);
    const clonedRender = render(cloned);
    expect(clonedRender.baseElement).toContainHTML(propChildRender.baseElement.innerHTML);
    expect(clonedRender.baseElement).toContainHTML(childRender.baseElement.innerHTML);
  });

  it('can add children as arrays', () => {
    const children = [<p key={1}>Another one</p>, <p key={2}>and two</p>, <p key={3}>third</p>];
    const propChild = <p>simple</p>;
    const el = <div className='children'>{propChild}</div>;
    const cloned = cloneElement(el, el.props, children);
    const childrenRender = render(<>{children}</>);
    const propChildRender = render(propChild);
    const clonedRender = render(cloned);
    expect(clonedRender.baseElement).toContainHTML(propChildRender.baseElement.innerHTML);
    expect(clonedRender.baseElement).toContainHTML(childrenRender.baseElement.innerHTML);
  });
});
