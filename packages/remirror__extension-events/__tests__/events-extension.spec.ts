import { jest } from '@jest/globals';
import { fireEvent } from '@testing-library/dom';
import { extensionValidityTest, renderEditor } from 'jest-remirror';

import { ContextMenuEventHandlerState, EventsExtension, HoverEventHandlerState } from '../';

extensionValidityTest(EventsExtension);

describe('events', () => {
  it('responds to editor `focus` events', () => {
    const eventsExtension = new EventsExtension();
    const focusHandler: any = jest.fn(() => true);
    const editor = renderEditor([eventsExtension]);
    const { doc, p } = editor.nodes;
    eventsExtension.addHandler('focus', focusHandler);

    editor.add(doc(p('first')));
    fireEvent.focus(editor.dom);

    expect(focusHandler).toHaveBeenCalled();
  });

  it('responds to editor `blur` events', () => {
    const eventsExtension = new EventsExtension();
    const blurHandler: any = jest.fn(() => true);
    const editor = renderEditor([eventsExtension]);
    const { doc, p } = editor.nodes;
    eventsExtension.addHandler('blur', blurHandler);

    editor.add(doc(p('first')));
    fireEvent.blur(editor.dom);

    expect(blurHandler).toHaveBeenCalled();
  });

  it('responds to editor `mousedown` events', () => {
    const eventsExtension = new EventsExtension();
    const mouseDownHandler: any = jest.fn(() => true);
    const editor = renderEditor([eventsExtension]);
    const { doc, p } = editor.nodes;
    eventsExtension.addHandler('mousedown', mouseDownHandler);

    editor.add(doc(p('first')));
    fireEvent.mouseDown(editor.dom);

    expect(mouseDownHandler).toHaveBeenCalled();
  });

  it('responds to editor `mouseup` events', () => {
    const eventsExtension = new EventsExtension();
    const mouseUpHandler: any = jest.fn(() => true);
    const editor = renderEditor([eventsExtension]);
    const { doc, p } = editor.nodes;
    eventsExtension.addHandler('mouseup', mouseUpHandler);

    editor.add(doc(p('first')));
    fireEvent.mouseUp(editor.dom);

    expect(mouseUpHandler).toHaveBeenCalled();
  });

  it.each([
    ['click', 'handleClickOn'],
    ['doubleClick', 'handleDoubleClickOn'],
    ['tripleClick', 'handleTripleClickOn'],
  ] as const)(
    'responds to editor `%s` events',
    (remirrorEventName, prosemirrorEventHandlerName) => {
      const eventsExtension = new EventsExtension();
      const clickHandler: any = jest.fn(() => true);
      const editor = renderEditor([eventsExtension]);
      const { view, add } = editor;
      const { doc, p } = editor.nodes;
      const node = p('first');

      eventsExtension.addHandler(remirrorEventName, clickHandler);
      add(doc(p('first')));

      // JSDOM doesn't pass events through so the only way to simulate is to
      // directly simulate the `handleClick` prop.
      view.someProp(prosemirrorEventHandlerName, (fn) =>
        fn(view, 2, node, 1, {} as MouseEvent, true),
      );
      expect(clickHandler).toHaveBeenCalled();
    },
  );

  it('should not throw when clicked on before first state called', () => {
    const eventsExtension = new EventsExtension();
    const editor = renderEditor([eventsExtension]);
    const { view } = editor;
    const { p } = editor.nodes;
    const node = p('first');

    expect(() =>
      editor.view.someProp('handleClickOn', (fn) => fn(view, 2, node, 1, {} as MouseEvent, true)),
    ).not.toThrow();
  });

  it('responds to editor `hover` events', () => {
    const eventsExtension = new EventsExtension();
    const hoverHandler: any = jest.fn((_: MouseEvent, __: HoverEventHandlerState) => true);
    const editor = renderEditor([eventsExtension]);
    const { doc, p } = editor.nodes;
    eventsExtension.addHandler('hover', hoverHandler);

    editor.add(doc(p('first')));
    fireEvent.mouseOver(editor.dom.querySelector('p') as Element);

    expect(hoverHandler).toHaveBeenCalledTimes(1);
    expect(hoverHandler.mock.calls[0]?.[0]).toBeInstanceOf(Event);
    expect(hoverHandler.mock.calls[0]?.[1]).not.toHaveProperty('event');
    expect(hoverHandler.mock.calls[0]?.[1]?.getNode).toBeFunction();
    expect(hoverHandler.mock.calls[0]?.[1]).toHaveProperty('hovering', true);

    fireEvent.mouseOut(editor.dom.querySelector('p') as Element);

    expect(hoverHandler).toHaveBeenCalledTimes(2);
    expect(hoverHandler.mock.calls[1]?.[0]).toBeInstanceOf(Event);
    expect(hoverHandler.mock.calls[1]?.[1]).not.toHaveProperty('event');
    expect(hoverHandler.mock.calls[1]?.[1]?.getNode).toBeFunction();
    expect(hoverHandler.mock.calls[1]?.[1]).toHaveProperty('hovering', false);
  });

  it('responds to editor `contextmenu` events', () => {
    const eventsExtension = new EventsExtension();
    const contextMenuHandler: any = jest.fn(
      (_: MouseEvent, __: ContextMenuEventHandlerState) => true,
    );
    const editor = renderEditor([eventsExtension]);
    const { doc, p } = editor.nodes;
    eventsExtension.addHandler('contextmenu', contextMenuHandler);

    editor.add(doc(p('first')));
    fireEvent.contextMenu(editor.dom.querySelector('p') as Element);

    expect(contextMenuHandler).toHaveBeenCalledTimes(1);
    expect(contextMenuHandler.mock.calls[0]?.[0]).toBeInstanceOf(Event);
    expect(contextMenuHandler.mock.calls[0]?.[1]).not.toHaveProperty('event');
    expect(contextMenuHandler.mock.calls[0]?.[1]?.getNode).toBeFunction();
  });
});
