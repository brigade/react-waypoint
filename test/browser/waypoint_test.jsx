/* eslint-disable react/no-multi-comp, react/no-render-return-value, react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
import { Waypoint } from '../../src/waypoint';

import { errorMessage as refNotUsedErrorMessage } from '../../src/ensureRefIsUsedByChild';

let div;

function renderAttached(component) {
  div = document.createElement('div');
  document.body.appendChild(div);
  const renderedComponent = ReactDOM.render(component, div);
  return renderedComponent;
}

function scrollNodeTo(node, scrollTop) {
  if (node === window) {
    window.scroll(0, scrollTop);
  } else {
    // eslint-disable-next-line no-param-reassign
    node.scrollTop = scrollTop;
  }
  const event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
}

describe('<Waypoint>', () => {
  let props;
  let margin;
  let parentHeight;
  let parentStyle;
  let topSpacerHeight;
  let bottomSpacerHeight;
  let subject;

  beforeEach(() => {
    jasmine.clock().install();
    spyOn(console, 'log');
    props = {
      onEnter: jasmine.createSpy('onEnter'),
      onLeave: jasmine.createSpy('onLeave'),
      onPositionChange: jasmine.createSpy('onPositionChange'),
    };

    margin = 10;
    parentHeight = 100;

    parentStyle = {
      height: parentHeight,
      overflow: 'auto',
      position: 'relative',
      width: 100,
      margin, // Normalize the space above the viewport.
    };

    topSpacerHeight = 0;
    bottomSpacerHeight = 0;

    subject = () => {
      const el = renderAttached(
        <div style={parentStyle}>
          <div style={{ height: topSpacerHeight }} />
          <Waypoint {...props} />
          <div style={{ height: bottomSpacerHeight }} />
        </div>,
      );

      jasmine.clock().tick(1);
      return el;
    };
  });

  afterEach(() => {
    if (div) {
      ReactDOM.unmountComponentAtNode(div);
    }
    scrollNodeTo(window, 0);
    jasmine.clock().uninstall();
  });

  it('logs to the console when called with debug = true', () => {
    props.debug = true;
    subject();
    expect(console.log).toHaveBeenCalled(); // eslint-disable-line no-console
  });

  describe('when the Waypoint is visible on mount', () => {
    beforeEach(() => {
      topSpacerHeight = 90;
      bottomSpacerHeight = 200;
      subject();
    });

    it('does not log to the console', () => {
      // eslint-disable-next-line no-console
      expect(console.log).not.toHaveBeenCalled();
    });

    it('calls the onEnter handler', () => {
      expect(props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: margin + topSpacerHeight,
        waypointBottom: margin + topSpacerHeight,
        viewportTop: margin,
        viewportBottom: margin + parentHeight,
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: margin + topSpacerHeight,
          waypointBottom: margin + topSpacerHeight,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is visible on mount and has topOffset < -100%', () => {
    beforeEach(() => {
      props.topOffset = '-200%';

      topSpacerHeight = 90;
      bottomSpacerHeight = 200;
      subject();
    });

    it('calls the onEnter handler', () => {
      expect(props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: margin + topSpacerHeight,
        waypointBottom: margin + topSpacerHeight,
        viewportTop: margin - (parentHeight * 2),
        viewportBottom: margin + parentHeight,
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: margin + topSpacerHeight,
          waypointBottom: margin + topSpacerHeight,
          viewportTop: margin - (parentHeight * 2),
          viewportBottom: margin + parentHeight,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is visible on mount and has bottomOffset < -100%', () => {
    beforeEach(() => {
      props.bottomOffset = '-200%';

      topSpacerHeight = 90;
      bottomSpacerHeight = 200;
      subject();
    });

    it('calls the onEnter handler', () => {
      expect(props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: margin + topSpacerHeight,
        waypointBottom: margin + topSpacerHeight,
        viewportTop: margin,
        viewportBottom: margin + (parentHeight * 3),
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: margin + topSpacerHeight,
          waypointBottom: margin + topSpacerHeight,
          viewportTop: margin,
          viewportBottom: margin + (parentHeight * 3),
        });
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is visible on mount and offsets < -100%', () => {
    beforeEach(() => {
      props.topOffset = '-200%';
      props.bottomOffset = '-200%';

      topSpacerHeight = 90;
      bottomSpacerHeight = 200;
      subject();
    });

    it('calls the onEnter handler', () => {
      expect(props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: margin + topSpacerHeight,
        waypointBottom: margin + topSpacerHeight,
        viewportTop: margin - (parentHeight * 2),
        viewportBottom: margin + (parentHeight * 3),
      });
    });

    it('calls the onPositionChange handler', () => {
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: margin + topSpacerHeight,
          waypointBottom: margin + topSpacerHeight,
          viewportTop: margin - (parentHeight * 2),
          viewportBottom: margin + (parentHeight * 3),
        });
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when scrolling while the waypoint is visible', () => {
    let parentComponent;
    let scrollable;

    beforeEach(() => {
      topSpacerHeight = 90;
      bottomSpacerHeight = 200;
      parentComponent = subject();
      scrollable = parentComponent;
      scrollNodeTo(scrollable, topSpacerHeight / 2);
    });

    it('does not call the onEnter handler again', () => {
      expect(props.onEnter.calls.count()).toBe(1);
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('does not call the onPositionChange handler again', () => {
      expect(props.onPositionChange.calls.count()).toBe(1);
    });
  });

  describe('when scrolling past the waypoint while it is visible', () => {
    let parentComponent;
    let scrollable;

    beforeEach(() => {
      topSpacerHeight = 90;
      bottomSpacerHeight = 200;
      parentComponent = subject();
      scrollable = parentComponent;
      scrollNodeTo(scrollable, topSpacerHeight + 10);
    });

    it('the onLeave handler is called', () => {
      expect(props.onLeave)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.above,
          previousPosition: Waypoint.inside,
          event: jasmine.any(Event),
          waypointTop: margin - 10,
          waypointBottom: margin - 10,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });

    it('does not call the onEnter handler', () => {
      expect(props.onEnter.calls.count()).toBe(1);
    });

    it('the onPositionChange is called', () => {
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.above,
          previousPosition: Waypoint.inside,
          event: jasmine.any(Event),
          waypointTop: margin - 10,
          waypointBottom: margin - 10,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });
  });

  describe('when the Waypoint is below the bottom', () => {
    beforeEach(() => {
      topSpacerHeight = 200;

      // The bottom spacer needs to be tall enough to force the Waypoint to exit
      // the viewport when scrolled all the way down.
      bottomSpacerHeight = 3000;
    });

    it('does not call the onEnter handler on mount', () => {
      subject();
      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler on mount', () => {
      subject();
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onPositionChange handler', () => {
      subject();
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.below,
          previousPosition: undefined,
          event: null,
          waypointTop: margin + topSpacerHeight,
          waypointBottom: margin + topSpacerHeight,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });

    describe('with children', () => {
      let childrenHeight;

      beforeEach(() => {
        childrenHeight = 80;
        props.children = (
          <div>
            <div style={{ height: childrenHeight / 2 }} />
            <div style={{ height: childrenHeight / 2 }} />
          </div>
        );
      });

      it('calls the onEnter handler when scrolling down far enough', () => {
        const component = subject();
        props.onPositionChange.calls.reset();
        scrollNodeTo(component, 100);

        expect(props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 100,
            waypointBottom: margin + topSpacerHeight - 100 + childrenHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });
    });

    describe('when scrolling down just below the threshold', () => {
      let component;

      beforeEach(() => {
        component = subject();
        props.onPositionChange.calls.reset();
        scrollNodeTo(component, 99);
      });

      it('does not call the onEnter handler', () => {
        expect(props.onEnter).not.toHaveBeenCalled();
      });

      it('does not call the onLeave handler', () => {
        expect(props.onLeave).not.toHaveBeenCalled();
      });

      it('does not call the onPositionChange handler', () => {
        expect(props.onPositionChange).not.toHaveBeenCalled();
      });
    });

    it('calls the onEnter handler when scrolling down past the threshold', () => {
      scrollNodeTo(subject(), 100);

      expect(props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: margin + topSpacerHeight - 100,
          waypointBottom: margin + topSpacerHeight - 100,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });

    it('calls the onPositionChange handler when scrolling down past the threshold', () => {
      scrollNodeTo(subject(), 100);

      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: margin + topSpacerHeight - 100,
          waypointBottom: margin + topSpacerHeight - 100,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });

    it('does not call the onLeave handler when scrolling down past the threshold', () => {
      scrollNodeTo(subject(), 100);
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    describe('when `fireOnRapidScroll` is disabled', () => {
      beforeEach(() => {
        props.fireOnRapidScroll = false;
      });

      it('calls the onEnter handler when scrolling down past the threshold', () => {
        scrollNodeTo(subject(), 100);

        expect(props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 100,
            waypointBottom: margin + topSpacerHeight - 100,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('calls the onPositionChange handler when scrolling down past the threshold', () => {
        scrollNodeTo(subject(), 100);

        expect(props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 100,
            waypointBottom: margin + topSpacerHeight - 100,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('does not call the onLeave handler when scrolling down past the threshold', () => {
        scrollNodeTo(subject(), 100);

        expect(props.onLeave).not.toHaveBeenCalled();
      });
    });

    describe('when scrolling quickly past the waypoint', () => {
      let scrollQuicklyPast;
      let component;

      // If you scroll really fast, we might not get a scroll event when the
      // waypoint is in view. We will get a scroll event before going into view
      // though, and one after. We want to treat this as if the waypoint was
      // visible for a brief moment, and so we fire both onEnter and onLeave.
      beforeEach(() => {
        scrollQuicklyPast = () => {
          component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, topSpacerHeight + bottomSpacerHeight);
        };
      });

      it('calls the onEnter handler', () => {
        scrollQuicklyPast();
        expect(props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: margin - bottomSpacerHeight + parentHeight,
            waypointBottom: margin - bottomSpacerHeight + parentHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('calls the onLeave handler', () => {
        scrollQuicklyPast();
        expect(props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: margin - bottomSpacerHeight + parentHeight,
            waypointBottom: margin - bottomSpacerHeight + parentHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('calls the onPositionChange handler', () => {
        scrollQuicklyPast();
        expect(props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.below,
            event: jasmine.any(Event),
            waypointTop: margin - bottomSpacerHeight + parentHeight,
            waypointBottom: margin - bottomSpacerHeight + parentHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      describe('when `fireOnRapidScroll` is disabled', () => {
        beforeEach(() => {
          props.fireOnRapidScroll = false;
        });

        it('does not call the onEnter handler', () => {
          scrollQuicklyPast();
          expect(props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          scrollQuicklyPast();
          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler', () => {
          scrollQuicklyPast();
          expect(props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin - bottomSpacerHeight + parentHeight,
              waypointBottom: margin - bottomSpacerHeight + parentHeight,
              viewportTop: margin,
              viewportBottom: margin + parentHeight,
            });
        });
      });
    });

    describe('with a non-zero topOffset', () => {
      describe('and the topOffset is passed as a percentage', () => {
        beforeEach(() => {
          props.topOffset = '-10%';
        });

        it('calls the onLeave handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 211);

          expect(props.onLeave)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.above,
              previousPosition: Waypoint.inside,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 211,
              waypointBottom: margin + topSpacerHeight - 211,
              viewportTop: margin + parentHeight * -0.1,
              viewportBottom: margin + parentHeight,
            });
        });
      });
    });

    describe('with a non-zero bottomOffset', () => {
      describe('and the bottomOffset is passed as a percentage', () => {
        beforeEach(() => {
          props.bottomOffset = '-10%';
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + Math.floor(parentHeight * 1.1),
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + Math.floor(parentHeight * 1.1),
            });
        });
      });

      describe('and the bottom offset is passed as a numeric string', () => {
        beforeEach(() => {
          props.bottomOffset = '-10';
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + parentHeight + 10,
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + parentHeight + 10,
            });
        });
      });

      describe('and the bottom offset is passed as a pixel string', () => {
        beforeEach(() => {
          props.bottomOffset = '-10px';
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + parentHeight + 10,
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('calls the onPositionChange handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + parentHeight + 10,
            });
        });
      });

      describe('and the bottom offset is passed as a number', () => {
        beforeEach(() => {
          props.bottomOffset = -10;
        });

        it('does not call the onEnter handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onEnter).not.toHaveBeenCalled();
        });

        it('does not call the onLeave handler when scrolling down near the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call onPositionChange handler when scrolling down near bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 89);

          expect(props.onPositionChange).not.toHaveBeenCalled();
        });

        it('calls the onEnter handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onEnter)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + parentHeight + 10,
            });
        });

        it('does not call the onLeave handler when scrolling down past the bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('calls onPositionChange handler when scrolling down past bottom offset', () => {
          const component = subject();
          props.onPositionChange.calls.reset();
          scrollNodeTo(component, 90);

          expect(props.onPositionChange)
            .toHaveBeenCalledWith({
              currentPosition: Waypoint.inside,
              previousPosition: Waypoint.below,
              event: jasmine.any(Event),
              waypointTop: margin + topSpacerHeight - 90,
              waypointBottom: margin + topSpacerHeight - 90,
              viewportTop: margin,
              viewportBottom: margin + parentHeight + 10,
            });
        });
      });
    });
  });

  describe('when the Waypoint has children', () => {
    it('does not throw with a DOM Element as a child', () => {
      props.children = <div />;
      expect(subject).not.toThrow();
    });

    it('does not throw with a Stateful Component as a child', () => {
      class StatefulComponent extends React.Component {
        render() {
          const { innerRef } = this.props;
          return <div ref={innerRef} />;
        }
      }

      props.children = <StatefulComponent />;
      expect(subject).not.toThrow();
    });

    it('errors when a Stateful Component does not provide ref to Waypoint', () => {
      // eslint-disable-next-line react/prefer-stateless-function
      class StatefulComponent extends React.Component {
        render() {
          return <div />;
        }
      }

      props.children = <StatefulComponent />;
      expect(subject).toThrowError(refNotUsedErrorMessage);
    });

    it('does not throw with a Stateless Component as a child', () => {
      const StatelessComponent = ({ innerRef }) => <div ref={innerRef} />;

      props.children = <StatelessComponent />;
      expect(subject).not.toThrow();
    });

    it('errors when a Stateless Component does not provide ref to Waypoint', () => {
      const StatelessComponent = () => <div />;

      props.children = <StatelessComponent />;
      expect(subject).toThrowError(refNotUsedErrorMessage);
    });
  });

  describe('when the Waypoint has children and is above the top', () => {
    let childrenHeight;
    let scrollable;

    beforeEach(() => {
      topSpacerHeight = 200;
      bottomSpacerHeight = 200;
      childrenHeight = 100;
      props.children = <div style={{ height: childrenHeight }} />;
      scrollable = subject();

      // Because of how we detect when a Waypoint is scrolled past without any
      // scroll event fired when it was visible, we need to reset callback
      // spies.
      scrollNodeTo(scrollable, 400);
      props.onEnter.calls.reset();
      props.onLeave.calls.reset();
      scrollNodeTo(scrollable, 400);
    });

    it('does not call the onEnter handler', () => {
      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onEnter handler when scrolled back up just past the bottom', () => {
      scrollNodeTo(scrollable, topSpacerHeight + 50);

      expect(props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.above,
          event: jasmine.any(Event),
          waypointTop: -40,
          waypointBottom: -40 + childrenHeight,
          viewportTop: margin,
          viewportBottom: margin + parentHeight,
        });
    });

    it('does not call the onLeave handler when scrolled back up just past the bottom', () => {
      scrollNodeTo(scrollable, topSpacerHeight + 50);

      expect(props.onLeave).not.toHaveBeenCalled();
    });
  });

  describe('when the Waypoint is above the top', () => {
    let scrollable;

    beforeEach(() => {
      topSpacerHeight = 200;
      bottomSpacerHeight = 200;
      scrollable = subject();

      // Because of how we detect when a Waypoint is scrolled past without any
      // scroll event fired when it was visible, we need to reset callback
      // spies.
      scrollNodeTo(scrollable, 400);
      props.onEnter.calls.reset();
      props.onLeave.calls.reset();
      props.onPositionChange.calls.reset();
      scrollNodeTo(scrollable, 400);
    });

    it('does not call the onEnter handler', () => {
      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('does not call the onPositionChange handler', () => {
      expect(props.onPositionChange).not.toHaveBeenCalled();
    });

    it('does not call the onEnter handler when scrolling up not past the threshold', () => {
      scrollNodeTo(scrollable, 201);

      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler when scrolling up not past the threshold', () => {
      scrollNodeTo(scrollable, 201);

      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('does not call onPositionChange handler when scrolling up not past the threshold', () => {
      scrollNodeTo(scrollable, 201);

      expect(props.onPositionChange).not.toHaveBeenCalled();
    });

    describe('when scrolling up past the threshold', () => {
      beforeEach(() => {
        scrollNodeTo(scrollable, 200);
      });

      it('calls the onEnter handler', () => {
        expect(props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 200,
            waypointBottom: margin + topSpacerHeight - 200,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('does not call the onLeave handler', () => {
        expect(props.onLeave).not.toHaveBeenCalled();
      });

      it('calls the onPositionChange handler', () => {
        expect(props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 200,
            waypointBottom: margin + topSpacerHeight - 200,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('calls the onLeave handler when scrolling up past the waypoint', () => {
        scrollNodeTo(scrollable, 99);

        expect(props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 99,
            waypointBottom: margin + topSpacerHeight - 99,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('does not call the onEnter handler again when scrolling up past the waypoint', () => {
        scrollNodeTo(scrollable, 99);

        expect(props.onEnter.calls.count()).toBe(1);
      });

      it('calls the onPositionChange handler when scrolling up past the waypoint', () => {
        scrollNodeTo(scrollable, 99);

        expect(props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight - 99,
            waypointBottom: margin + topSpacerHeight - 99,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });
    });

    describe('when scrolling up quickly past the waypoint', () => {
      // If you scroll really fast, we might not get a scroll event when the
      // waypoint is in view. We will get a scroll event before going into view
      // though, and one after. We want to treat this as if the waypoint was
      // visible for a brief moment, and so we fire both onEnter and onLeave.
      beforeEach(() => {
        scrollNodeTo(scrollable, 0);
      });

      it('calls the onEnter handler', () => {
        expect(props.onEnter)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.inside,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight,
            waypointBottom: margin + topSpacerHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('calls the onLeave handler', () => {
        expect(props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight,
            waypointBottom: margin + topSpacerHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });

      it('calls the onPositionChange handler', () => {
        expect(props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.below,
            previousPosition: Waypoint.above,
            event: jasmine.any(Event),
            waypointTop: margin + topSpacerHeight,
            waypointBottom: margin + topSpacerHeight,
            viewportTop: margin,
            viewportBottom: margin + parentHeight,
          });
      });
    });
  });

  describe('when the scrollable parent is not displayed', () => {
    it('calls the onLeave handler', () => {
      const component = subject();
      const node = ReactDOM.findDOMNode(component);
      node.style.display = 'none';
      scrollNodeTo(component, 0);
      expect(props.onLeave)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.invisible,
          previousPosition: Waypoint.inside,
          event: jasmine.any(Event),
          waypointTop: 0,
          waypointBottom: 0,
          viewportTop: 0,
          viewportBottom: 0,
        });
    });
  });

  describe('when the window is the scrollable parent', () => {
    beforeEach(() => {
      // Make the normal parent non-scrollable
      parentStyle.height = 'auto';
      parentStyle.overflow = 'visible';

      // This is only here to try and confuse the _findScrollableAncestor code.
      document.body.style.overflow = 'auto';

      // Make the spacers large enough to make the Waypoint render off-screen
      topSpacerHeight = window.innerHeight + 1000;
      bottomSpacerHeight = 1000;
    });

    afterEach(() => {
      // Reset body style
      document.body.style.overflow = '';
    });

    it('does not fire the onEnter handler on mount', () => {
      subject();
      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('fires the onPositionChange handler on mount', () => {
      subject();
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.below,
          previousPosition: undefined,
          event: null,
          waypointTop: margin + topSpacerHeight,
          waypointBottom: margin + topSpacerHeight,
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    it('fires the onEnter handler when the Waypoint is in view', () => {
      subject();
      scrollNodeTo(window, topSpacerHeight - window.innerHeight / 2);

      expect(props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: margin + Math.ceil(window.innerHeight / 2),
          waypointBottom: margin + Math.ceil(window.innerHeight / 2),
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    it('fires the onPositionChange handler when the Waypoint is in view', () => {
      subject();
      scrollNodeTo(window, topSpacerHeight - window.innerHeight / 2);

      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: Waypoint.below,
          event: jasmine.any(Event),
          waypointTop: margin + Math.ceil(window.innerHeight / 2),
          waypointBottom: margin + Math.ceil(window.innerHeight / 2),
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });
  });

  it('does not throw an error when the <html> is the scrollable parent', () => {
    // Give the <html> an overflow style
    document.documentElement.style.overflow = 'auto';

    // Make the normal parent non-scrollable
    parentStyle.height = 'auto';
    parentStyle.overflow = 'visible';

    expect(subject).not.toThrow();

    delete document.documentElement.style.overflow;
  });

  describe('when the waypoint is updated in the onEnter callback', () => {
    beforeEach(() => {
      class Wrapper extends React.Component {
        render() {
          const doOnEnter = () => {
            const { onEnter } = this.props;
            onEnter();
            this.forceUpdate();
          };

          return (
            <div style={{ margin: `${window.innerHeight * 2}px 0` }}>
              <Waypoint onEnter={doOnEnter} />
            </div>
          );
        }
      }

      subject = () => renderAttached(<Wrapper {...props} />);
    });

    it('only calls onEnter once', (done) => {
      subject();

      setTimeout(() => {
        scrollNodeTo(window, window.innerHeight);
        expect(props.onEnter.calls.count()).toBe(1);
        done();
      }, 0);

      jasmine.clock().tick(5000);
    });
  });

  describe('when the <body> itself has a margin', () => {
    beforeEach(() => {
      // document.body.style.marginTop = '0px';
      document.body.style.marginTop = '20px';
      document.body.style.position = 'relative';
      // topSpacerHeight = 20;

      // Make the spacers large enough to make the Waypoint render off-screen
      bottomSpacerHeight = window.innerHeight + 1000;

      // Make the normal parent non-scrollable
      parentStyle = {};

      subject();
    });

    afterEach(() => {
      document.body.style.marginTop = '';
      document.body.style.position = '';
    });

    it('calls the onEnter handler', () => {
      expect(props.onEnter)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: 20 + topSpacerHeight,
          waypointBottom: 20 + topSpacerHeight,
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('calls the onPositionChange handler', () => {
      expect(props.onPositionChange)
        .toHaveBeenCalledWith({
          currentPosition: Waypoint.inside,
          previousPosition: undefined,
          event: null,
          waypointTop: 20 + topSpacerHeight,
          waypointBottom: 20 + topSpacerHeight,
          viewportTop: 0,
          viewportBottom: window.innerHeight,
        });
    });

    describe('when scrolling while the waypoint is visible', () => {
      beforeEach(() => {
        props.onPositionChange.calls.reset();
        scrollNodeTo(window, 10);
      });

      it('does not call the onEnter handler again', () => {
        expect(props.onEnter.calls.count()).toBe(1);
      });

      it('does not call the onLeave handler', () => {
        expect(props.onLeave).not.toHaveBeenCalled();
      });

      it('does not call the onPositionChange handler', () => {
        expect(props.onPositionChange).not.toHaveBeenCalled();
      });

      it('the onLeave handler is called when scrolling past the waypoint', () => {
        scrollNodeTo(window, 25);

        expect(props.onLeave)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: 20 + topSpacerHeight - 25,
            waypointBottom: 20 + topSpacerHeight - 25,
            viewportTop: 0,
            viewportBottom: window.innerHeight,
          });
      });

      it('does not call the onEnter handler when scrolling past the waypoint', () => {
        scrollNodeTo(window, 25);

        expect(props.onEnter.calls.count()).toBe(1);
      });

      it('the onPositionChange handler is called when scrolling past the waypoint', () => {
        scrollNodeTo(window, 25);

        expect(props.onPositionChange)
          .toHaveBeenCalledWith({
            currentPosition: Waypoint.above,
            previousPosition: Waypoint.inside,
            event: jasmine.any(Event),
            waypointTop: 20 + topSpacerHeight - 25,
            waypointBottom: 20 + topSpacerHeight - 25,
            viewportTop: 0,
            viewportBottom: window.innerHeight,
          });
      });
    });
  });

  describe('When the parent element is not displayed', () => {
    beforeEach(() => {
      subject = () => {
        parentStyle = {
          height: 100,
          display: 'none',
        };
        const el = renderAttached(
          <div style={parentStyle}>
            <div style={{ display: 'inline-block' }} />
            <Waypoint {...props} />
            <div style={{ display: 'inline-block' }} />
          </div>,
        );

        jasmine.clock().tick(1);
        return el;
      };
    });

    afterEach(() => { });

    it('does not call the onEnter handler', () => {
      expect(props.onEnter).not.toHaveBeenCalled();
    });

    it('does not call the onLeave handler', () => {
      expect(props.onLeave).not.toHaveBeenCalled();
    });

    it('does not call the onPositionChange handler', () => {
      expect(props.onPositionChange).not.toHaveBeenCalled();
    });
  });
});

// smoke tests for horizontal scrolling
function scrollNodeToHorizontal(node, scrollLeft) {
  if (node === window) {
    window.scroll(scrollLeft, 0);
  } else {
    // eslint-disable-next-line no-param-reassign
    node.scrollLeft = scrollLeft;
  }
  const event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
}

describe('<Waypoint> Horizontal', () => {
  let props;
  let margin;
  let parentWidth;
  let parentStyle;
  let leftSpacerWidth;
  let rightSpacerWidth;
  let subject;

  beforeEach(() => {
    jasmine.clock().install();
    document.body.style.margin = 'auto'; // should be no horizontal margin

    props = {
      onEnter: jasmine.createSpy('onEnter'),
      onLeave: jasmine.createSpy('onLeave'),
      horizontal: true,
    };

    margin = 10;
    parentWidth = 100;

    parentStyle = {
      height: 100,
      overflow: 'auto',
      whiteSpace: 'nowrap',
      width: parentWidth,
      margin, // Normalize the space left of the viewport.
    };

    leftSpacerWidth = 0;
    rightSpacerWidth = 0;

    subject = () => {
      const el = renderAttached(
        <div style={parentStyle}>
          <div style={{ width: leftSpacerWidth, display: 'inline-block' }} />
          <Waypoint {...props} />
          <div style={{ width: rightSpacerWidth, display: 'inline-block' }} />
        </div>,
      );

      jasmine.clock().tick(1);
      return el;
    };
  });

  afterEach(() => {
    if (div) {
      ReactDOM.unmountComponentAtNode(div);
    }
    scrollNodeToHorizontal(window, 0);
    jasmine.clock().uninstall();
  });

  describe('when a div is the scrollable ancestor', () => {
    it('calls the onEnter handler when the Waypoint is visible on mount', () => {
      subject();

      expect(props.onEnter).toHaveBeenCalledWith({
        currentPosition: Waypoint.inside,
        previousPosition: undefined,
        event: null,
        waypointTop: margin + leftSpacerWidth,
        waypointBottom: margin + leftSpacerWidth,
        viewportTop: margin,
        viewportBottom: margin + parentWidth,
      });
    });

    it('does not call the onEnter handler when the Waypoint is not visible on mount', () => {
      leftSpacerWidth = 300;
      subject();
      expect(props.onEnter).not.toHaveBeenCalled();
    });
  });

  describe('when the window is the scrollable ancestor', () => {
    beforeEach(() => {
      delete parentStyle.overflow;
      delete parentStyle.width;
    });

    it('calls the onEnter handler when the Waypoint is visible on mount', () => {
      subject();
      expect(props.onEnter).toHaveBeenCalled();
    });

    describe('when the Waypoint is not visible on mount', () => {
      beforeEach(() => {
        leftSpacerWidth = window.innerWidth * 2;
        subject();
      });

      it('does not call the onEnter handler', () => {
        expect(props.onEnter).not.toHaveBeenCalled();
      });

      describe('when scrolled sideways to make the waypoint visible', () => {
        beforeEach(() => {
          scrollNodeToHorizontal(window, window.innerWidth + 100);
        });

        it('calls the onEnter handler', () => {
          expect(props.onEnter).toHaveBeenCalled();
        });

        it('does not call the onLeave handler', () => {
          expect(props.onLeave).not.toHaveBeenCalled();
        });

        it('does not call the onEnter handler when scrolled back to initial position', () => {
          props.onEnter.calls.reset();
          scrollNodeToHorizontal(window, 0);

          expect(props.onEnter).not.toHaveBeenCalled();
        });

        it('calls the onLeave handler when scrolled back to initial position', () => {
          props.onEnter.calls.reset();
          scrollNodeToHorizontal(window, 0);

          expect(props.onLeave).toHaveBeenCalled();
        });
      });
    });
  });
});
