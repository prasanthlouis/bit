import { NavLink } from '@teambit/base-ui.routing.nav-link';
import classNames from 'classnames';
import React, { ComponentType } from 'react';
import { indentClass } from '@teambit/base-ui.graph.tree.indent';
import { TreeNodeProps, TreeNode as TreeNodeType } from '@teambit/base-ui.graph.tree.recursive-tree';
import styles from './tree-node.module.scss';

export type WidgetProps<Payload> = {
  node: TreeNodeType<Payload>;
};

export type TreeNodeComponentProps<Payload = any> = {
  widgets?: ComponentType<WidgetProps<Payload>>[];
  isActive?: boolean;
  icon?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
} & TreeNodeProps<Payload>;

/**
 *
 * Renders a file node in the file tree
 */
export function TreeNode<T>(props: TreeNodeComponentProps<T>) {
  const { node, isActive, icon, onClick, widgets, href } = props;

  const active = isActive !== undefined ? () => isActive : undefined;

  return (
    <NavLink
      href={href || node.id}
      isActive={active}
      exact
      strict
      className={classNames(indentClass, styles.fileNode)}
      activeClassName={styles.active}
      onClick={onClick}
    >
      <div className={styles.left}>
        {icon && <img className={styles.icon} src={icon} />}
        <span>{node.id.split('/').pop()}</span>
      </div>

      <div className={styles.right}>
        {widgets?.map((Widget, index) => (
          <Widget key={index} node={node} />
        ))}
      </div>
    </NavLink>
  );
}
