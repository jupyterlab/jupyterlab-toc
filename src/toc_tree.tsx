// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as React from 'react';
import { Widget } from '@lumino/widgets';
import { IHeading } from './utils/headings';
import { TableOfContentsRegistry as Registry } from './registry';
import { TOCItem } from './toc_item';

/**
 * Interface describing component properties.
 *
 * @private
 */
interface IProperties extends React.Props<TOCTree> {
  /**
   * Display title.
   */
  title: string;

  /**
   * List of headings to render.
   */
  toc: IHeading[];

  /**
   * Toolbar.
   */
  toolbar: any;

  /**
   * Table of contents generator.
   */
  generator: Registry.IGenerator<Widget> | null;

  /**
   * Renders a heading item.
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
interface IState {}

/**
 * React component for a table of contents tree.
 *
 * @private
 */
class TOCTree extends React.Component<IProperties, IState> {
  /**
   * Renders a table of contents tree.
   */
  render() {
    const Toolbar = this.props.toolbar;

    /* keyPress function to handle selection */
    const keyPressed = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          arrowDown();
          break;
        case 'ArrowUp':
          arrowUp();
          break;
        default:
      }
    };

    const arrowDown = () => {
      let ul = document.getElementsByClassName('jp-TableOfContents-content')[0];
      let activeElment = ul.getElementsByClassName('active')[0];
      let next = activeElment?.nextElementSibling as HTMLElement;
      if (next) {
        activeElment.classList.remove('active');
        next.classList.add('active');
        next.click();
      }
    };

    const arrowUp = () => {
      let ul = document.getElementsByClassName('jp-TableOfContents-content')[0];
      let activeElment = ul.getElementsByClassName('active')[0];
      let prev = activeElment?.previousElementSibling as HTMLElement;
      if (prev) {
        activeElment.classList.remove('active');
        prev.classList.add('active');
        prev.click();
      }
    };

    // Map the heading objects onto a list of JSX elements...
    let i = 0;
    let list: JSX.Element[] = this.props.toc.map(el => {
      return (
        <TOCItem
          heading={el}
          itemRenderer={this.props.itemRenderer}
          key={`${el.text}-${el.level}-${i++}`}
        />
      );
    });
    return (
      <div className="jp-TableOfContents" onKeyDown={keyPressed} tabIndex={0}>
        <header>{this.props.title}</header>
        {Toolbar && <Toolbar />}
        <ul className="jp-TableOfContents-content" tabIndex={0}>
          {list}
        </ul>
      </div>
    );
  }
}

/**
 * Exports.
 */
export { TOCTree };
