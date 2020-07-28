import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { settings } from '../../constants/Settings';
import SimplePagination, { SimplePaginationPropTypes } from '../SimplePagination/SimplePagination';
import { SkeletonText } from '../SkeletonText';

import ListItem from './ListItem/ListItem';
import ListHeader from './ListHeader/ListHeader';

const { iotPrefix } = settings;

export const itemPropTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    value: PropTypes.string,
    icon: PropTypes.node,
  }),
  children: PropTypes.arrayOf(PropTypes.object),
  isSelectable: PropTypes.bool,
};

const propTypes = {
  /** list title */
  title: PropTypes.string,
  /** search bar call back function and search value */
  search: PropTypes.shape({
    onChange: PropTypes.func,
    value: PropTypes.string,
  }),
  /** action buttons on right side of list title */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** data source of list items */
  items: PropTypes.arrayOf(PropTypes.shape(itemPropTypes)).isRequired,
  /** list can be rearranged */
  isEditing: PropTypes.bool,
  /** use full height in list */
  isFullHeight: PropTypes.bool,
  /** use large/fat row in list */
  isLargeRow: PropTypes.bool,
  /** optional skeleton to be rendered while loading data */
  isLoading: PropTypes.bool,
  /** icon can be left or right side of list row primary value */
  iconPosition: PropTypes.oneOf(['left', 'right']),
  /** i18n strings */
  i18n: PropTypes.shape({
    searchPlaceHolderText: PropTypes.string,
    expand: PropTypes.string,
    close: PropTypes.string,
  }),
  /** Currently selected item */
  selectedId: PropTypes.string,
  /** Multiple currently selected items */
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** pagination at the bottom of list */
  pagination: PropTypes.shape(SimplePaginationPropTypes),
  /** ids of row expanded */
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  /** call back function of select */
  handleSelect: PropTypes.func,
  /** call back function of expansion */
  toggleExpansion: PropTypes.func,
  /** callback function for reorder */
  onItemMoved: PropTypes.func,
};

const defaultProps = {
  title: null,
  search: null,
  buttons: [],
  isEditing: false,
  isFullHeight: false,
  isLargeRow: false,
  isLoading: false,
  i18n: {
    searchPlaceHolderText: 'Enter a value',
    expand: 'Expand',
    close: 'Close',
  },
  iconPosition: 'left',
  pagination: null,
  selectedId: null,
  selectedIds: [],
  expandedIds: [],
  handleSelect: () => {},
  toggleExpansion: () => {},
  onItemMoved: () => {},
};

const List = forwardRef((props, ref) => {
  // Destructuring this way is needed to retain the propTypes and defaultProps
  const {
    title,
    search,
    buttons,
    items,
    isFullHeight,
    i18n,
    pagination,
    selectedId,
    selectedIds,
    expandedIds,
    handleSelect,
    toggleExpansion,
    iconPosition,
    isEditing,
    isLargeRow,
    isLoading,
    onItemMoved,
  } = props;
  const selectedItemRef = ref;
  const renderItemAndChildren = (item, index, level) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = item.id === selectedId || selectedIds.some(id => item.id === id);
    const isExpanded = expandedIds.filter(rowId => rowId === item.id).length > 0;

    const {
      content: { value, secondaryValue, icon, rowActions },
      isSelectable,
      isCategory,
    } = item;

    return [
      <ListItem
        id={item.id}
        index={index}
        key={`${item.id}-list-item-${level}-${value}`}
        nestingLevel={level}
        value={value}
        icon={icon}
        iconPosition={iconPosition}
        isEditing={isEditing}
        secondaryValue={secondaryValue}
        rowActions={rowActions}
        onSelect={handleSelect}
        onExpand={toggleExpansion}
        selected={isSelected}
        expanded={isExpanded}
        isExpandable={hasChildren}
        isLargeRow={isLargeRow}
        isCategory={isCategory}
        isSelectable={isSelectable}
        i18n={i18n}
        selectedItemRef={isSelected ? selectedItemRef : null}
        onItemMoved={onItemMoved}
      />,
      ...(hasChildren && isExpanded
        ? item.children.map((child, nestedIndex) =>
            renderItemAndChildren(child, nestedIndex, level + 1)
          )
        : []),
    ];
  };

  const listItems = items.map((item, index) => renderItemAndChildren(item, index, 0));

  return (
    <div
      className={classnames(`${iotPrefix}--list`, {
        [`${iotPrefix}--list__full-height`]: isFullHeight,
      })}
    >
      <ListHeader
        className={`${iotPrefix}--list--header`}
        title={title}
        buttons={buttons}
        search={search}
        i18n={i18n}
        isLoading={isLoading}
      />
      <div
        className={classnames(
          {
            // If FullHeight, the content's overflow shouldn't be hidden
            [`${iotPrefix}--list--content__full-height`]: isFullHeight,
          },
          `${iotPrefix}--list--content`
        )}
      >
        {!isLoading ? (
          listItems
        ) : (
          <SkeletonText className={`${iotPrefix}--list--skeleton`} width="90%" />
        )}
      </div>
      {pagination && !isLoading ? (
        <div className={`${iotPrefix}--list--page`}>
          <SimplePagination {...pagination} />
        </div>
      ) : null}
    </div>
  );
});

List.propTypes = propTypes;
List.defaultProps = defaultProps;

export { List as UnconnectedList };
export default DragDropContext(HTML5Backend)(List);
