// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CodeCell } from '@jupyterlab/cells';
import { NotebookPanel } from '@jupyterlab/notebook';
import { IHeading, INotebookHeading } from './utils/headings';

/**
 * Tests whether a heading is a notebook heading.
 *
 * @private
 * @param heading - heading to test
 * @returns boolean indicating whether a heading is a notebook heading
 */
function isNotebookHeading(heading: any): heading is INotebookHeading {
  return heading.type !== undefined && heading.cellRef !== undefined;
}

/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties extends React.Props<TOCItem> {
  /**
   * List of all headings.
   */
  headings: IHeading[];

  /**
   * Heading to render.
   */
  heading: IHeading;

  /**
   * Renders a heading.
   *
   * @param item - heading
   * @returns rendered heading
   */
  itemRenderer: (item: IHeading) => JSX.Element | null;
}

/**
 * Interface describing component state.
 *
 * @private
 */
interface IState {
  /**
   * Mouse x-position.
   */
  mouseX: number | null;

  /**
   * Mouse y-position.
   */
  mouseY: number | null;
}

/**
 * React component for a table of contents entry.
 *
 * @private
 */
class TOCItem extends React.Component<IProperties, IState> {
  /**
   * Returns a component which renders a table of contents entry.
   *
   * @param props - component properties
   * @returns component
   */
  constructor(props: IProperties) {
    super(props);
    this.state = {
      mouseX: null,
      mouseY: null
    };
  }

  /**
   * Renders a table of contents entry.
   *
   * @returns rendered entry
   */
  render() {
    const { heading } = this.props;

    // Create an onClick handler for the TOC item
    // that scrolls the anchor into view.
    const onClick = (event: React.SyntheticEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
      heading.onClick();
    };

    let content = this.props.itemRenderer(heading);
    if (!content) {
      return null;
    }
    const FLG = isNotebookHeading(heading);
    return (
      <ListItem
        onClick={onClick}
        onContextMenu={
          FLG
            ? this._onContextMenuFactory(heading as INotebookHeading)
            : undefined
        }
      >
        {content}
        {FLG ? (
          <Menu
            keepMounted
            classes={{
              list: 'jp-TableOfContents-item-contextmenu'
            }}
            open={this.state.mouseY !== null}
            onClose={this._onContextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
              this.state.mouseY !== null && this.state.mouseX !== null
                ? { top: this.state.mouseY, left: this.state.mouseX }
                : void 0
            }
          >
            <MenuItem
              className="jp-TableOfContents-item-contextmenu-item"
              onClick={this._onRunFactory(heading as INotebookHeading)}
            >
              Run Cells
            </MenuItem>
          </Menu>
        ) : null}
      </ListItem>
    );
  }

  /**
   * Returns a callback which is invoked upon opening a context menu.
   *
   * @param heading - heading
   * @returns callback
   */
  private _onContextMenuFactory(heading: INotebookHeading) {
    const self = this;
    return onContextMenu;

    /**
     * Callback invoked upon opening a job's context menu.
     *
     * @private
     * @param event - event object
     */
    function onContextMenu(event: any): void {
      event.preventDefault();
      event.stopPropagation();

      self.setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4
      });
    }
  }

  /**
   * Returns a callback which is invoked upon clicking a menu item to run code cells.
   *
   * @param heading - heading
   * @returns callback
   */
  private _onRunFactory(heading: INotebookHeading) {
    const self = this;
    return onClick;

    /**
     * Callback invoked upon clicking a menu item to run code cells.
     *
     * @private
     * @param event - event object
     */
    async function onClick(event: any): Promise<void> {
      let code: INotebookHeading[];
      let h: INotebookHeading;
      let i: number;

      event.preventDefault();
      event.stopPropagation();

      self._closeContextMenu();

      // Find the heading in the list of ToC headings...
      const headings = self.props.headings;
      for (i = 0; i < headings.length; i++) {
        if (heading === headings[i]) {
          break;
        }
      }
      // Find all nested code headings...
      const level = heading.level;
      code = [];
      for (i = i + 1; i < headings.length; i++) {
        h = headings[i] as INotebookHeading;
        if (h.level <= level) {
          break;
        }
        if (h.type === 'code') {
          code.push(h);
        }
      }
      // Run each of the associated code cells...
      for (i = 0; i < code.length; i++) {
        if (code[i].cellRef) {
          const cell = code[i].cellRef as CodeCell;
          const panel = cell.parent?.parent as NotebookPanel;
          if (panel) {
            await CodeCell.execute(cell, panel.sessionContext);
          }
        }
      }
    }
  }

  /**
   * Callback invoked upon closing a context menu.
   *
   * @param event - event object
   */
  private _onContextMenuClose = (event: any): void => {
    event.preventDefault();
    event.stopPropagation();

    this._closeContextMenu();
  };

  /**
   * Closes a context menu.
   */
  private _closeContextMenu(): void {
    this.setState({
      mouseX: null,
      mouseY: null
    });
  }
}

/**
 * Exports.
 */
export { TOCItem };
