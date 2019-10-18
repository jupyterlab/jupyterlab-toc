// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';

import { OptionsManager } from './options_manager';

/**
 * Interface describing toolbar properties.
 *
 * @private
 */
interface IToolbarProps {}

/**
 * Interface describing toolbar state.
 *
 * @private
 */
interface IToolbarState {
  /**
   * Boolean indicating whether numbering is enabled.
   */
  numbering: boolean;
}

/**
 * Returns a generator for rendering a Markdown table of contents toolbar.
 *
 * @private
 * @param options - generator options
 * @returns toolbar generator
 */
function toolbar(options: OptionsManager) {
  return class extends React.Component<IToolbarProps, IToolbarState> {
    /**
     * Returns a generator for rendering a Markdown table of contents toolbar.
     *
     * @param props - toolbar properties
     * @returns toolbar generator
     */
    constructor(props: IToolbarProps) {
      super(props);
      this.state = { numbering: false };
      options.initializeOptions(false);
    }

    /**
     * Renders a toolbar.
     *
     * @returns rendered toolbar
     */
    render() {
      const toggleAutoNumbering = () => {
        options.numbering = !options.numbering;
        this.setState({ numbering: options.numbering });
      };
      let icon;
      if (this.state.numbering) {
        icon = (
          <div
            className="toc-toolbar-auto-numbering-button toc-toolbar-button"
            onClick={event => toggleAutoNumbering()}
          >
            <div
              role="text"
              aria-label="Toggle Auto-Numbering"
              title="Toggle Auto-Numbering"
              className="toc-toolbar-auto-numbering-icon toc-toolbar-icon-selected"
            />
          </div>
        );
      } else {
        icon = (
          <div
            className="toc-toolbar-auto-numbering-button toc-toolbar-button"
            onClick={event => toggleAutoNumbering()}
          >
            <div
              role="text"
              aria-label="Toggle Auto-Numbering"
              title="Toggle Auto-Numbering"
              className="toc-toolbar-auto-numbering-icon toc-toolbar-icon"
            />
          </div>
        );
      }
      return (
        <div>
          <div className={'toc-toolbar'}>{icon}</div>
        </div>
      );
    }
  };
}

/**
 * Exports.
 */
export { toolbar };