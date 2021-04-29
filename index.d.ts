import * as React from 'react';

export declare class Waypoint extends React.Component<Waypoint.WaypointProps, {}> {
  static above: string;
  static below: string;
  static inside: string;
  static invisible: string;
}

declare namespace Waypoint {
    interface CallbackArgs {
        /*
         * The position that the waypoint has at the moment.
         * One of Waypoint.below, Waypoint.above, Waypoint.inside, and Waypoint.invisible.
         */
        currentPosition: string;

        /*
         * The position that the waypoint had before.
         * One of Waypoint.below, Waypoint.above, Waypoint.inside, and Waypoint.invisible.
         */
        previousPosition: string;

        /*
         * The native scroll event that triggered the callback.
         * May be missing if the callback wasn't triggered as the result of a scroll
         */
        event?: Event;

        /*
         * The waypoint's distance to the top of the viewport.
         */
        waypointTop: number;

        /*
         * The distance from the scrollable ancestor to the viewport top.
         */
        viewportTop: number;

        /*
         * The distance from the bottom of the scrollable ancestor to the viewport top.
         */
        viewportBottom: number;
    }

    interface CallbackProgressArgs extends CallbackArgs {
        /*
         * Indicates the progress between the enter and leave event with a number between 0 and 1.
         */
        progress: number;
    }

    interface WaypointProps {
        /**
         * Function called when waypoint enters viewport
         * @param {CallbackArgs} args
         */
        onEnter?: (args: CallbackArgs) => void;

        /**
         * Function called when waypoint leaves viewport
         * @param {CallbackArgs} args
         */
        onLeave?: (args: CallbackArgs) => void;

        /**
         * Function called when waypoint is inside viewport and a scroll event happens.
         * @param {CallbackProgressArgs} args
         */
        onProgress?: (args: CallbackProgressArgs) => void;

        /**
         * Function called when waypoint position changes
         * @param {CallbackArgs} args
         */
        onPositionChange?: (args: CallbackArgs) => void;

        /**
         * Whether to activate on horizontal scrolling instead of vertical
         */
        horizontal?: boolean;

        /**
         * `topOffset` can either be a number, in which case its a distance from the
         * top of the container in pixels, or a string value. Valid string values are
         * of the form "20px", which is parsed as pixels, or "20%", which is parsed
         * as a percentage of the height of the containing element.
         * For instance, if you pass "-20%", and the containing element is 100px tall,
         * then the waypoint will be triggered when it has been scrolled 20px beyond
         * the top of the containing element.
         */
        topOffset?: string|number;

        /**
         * `bottomOffset` can either be a number, in which case its a distance from the
         * bottom of the container in pixels, or a string value. Valid string values are
         * of the form "20px", which is parsed as pixels, or "20%", which is parsed
         * as a percentage of the height of the containing element.
         * For instance, if you pass "20%", and the containing element is 100px tall,
         * then the waypoint will be triggered when it has been scrolled 20px beyond
         * the bottom of the containing element.
         * 
         * Similar to `topOffset`, but for the bottom of the container.
         */
        bottomOffset?: string|number;

        /**
         * A custom ancestor to determine if the target is visible in it.
         * This is useful in cases where you do not want the immediate scrollable
         * ancestor to be the container. For example, when your target is in a div
         * that has overflow auto but you are detecting onEnter based on the window.
         */
        scrollableAncestor?: any;

        /**
         * If the onEnter/onLeave events are to be fired on rapid scrolling.
         * This has no effect on onPositionChange -- it will fire anyway.
         */
        fireOnRapidScroll?: boolean;

        /**
         * Use this prop to get debug information in the console log. This slows
         * things down significantly, so it should only be used during development.
         */
        debug?: boolean;
    }
}
