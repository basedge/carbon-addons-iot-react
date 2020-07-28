import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import classnames from 'classnames';
import { Draggable16, ChevronUp16, ChevronDown16 } from '@carbon/icons-react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import { settings } from '../../../constants/Settings';

const { iotPrefix } = settings;

// internal component
const ListItemWrapper = props => {
  const {
    id,
    isEditing,
    isSelectable,
    onSelect,
    selected,
    isDragging,
    isLargeRow,
    children,
    connectDropTarget,
    connectDragSource,
  } = props;

  const body = isSelectable ? (
    <div
      role="button"
      tabIndex={0}
      className={classnames(
        `${iotPrefix}--list-item`,
        `${iotPrefix}--list-item__selectable`,
        { [`${iotPrefix}--list-item__selected`]: selected },
        { [`${iotPrefix}--list-item__large`]: isLargeRow },
        { [`${iotPrefix}--list-item-editable`]: isEditing }
      )}
      onKeyPress={({ key }) => key === 'Enter' && onSelect(id)}
      onClick={() => {
        onSelect(id);
      }}
    >
      {children}
    </div>
  ) : (
    <div
      className={classnames(`${iotPrefix}--list-item`, {
        [`${iotPrefix}--list-item__large`]: isLargeRow,
        [`${iotPrefix}--list-item-editable`]: isEditing,
      })}
    >
      {children}
    </div>
  );

  const opacity = isDragging ? 0 : 1;

  if (isEditing) {
    return (
      <div
        style={{ opacity }}
        ref={instance => {
          if (connectDragSource && connectDropTarget) {
            connectDragSource(instance);
            connectDropTarget(instance);
          }
        }}
      >
        {body}
      </div>
    );
  }

  return body;
};

const ListItemWrapperProps = {
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isLargeRow: PropTypes.bool.isRequired,
  isSelectable: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

const ListItemPropTypes = {
  id: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  isLargeRow: PropTypes.bool,
  isExpandable: PropTypes.bool,
  onExpand: PropTypes.func,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  expanded: PropTypes.bool,
  value: PropTypes.string.isRequired,
  secondaryValue: PropTypes.string,
  rowActions: PropTypes.arrayOf(PropTypes.node), // TODO
  icon: PropTypes.node,
  iconPosition: PropTypes.string,
  nestingLevel: PropTypes.number,
  isCategory: PropTypes.bool,
  /** i18n strings */
  i18n: PropTypes.shape({
    expand: PropTypes.string,
    close: PropTypes.string,
  }),
  /** Default selected item ref needed for scrolling */
  selectedItemRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  /* these props come from react-dnd */
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
  isDragging: PropTypes.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  isOver: PropTypes.bool.isRequired, // eslint-disable-line react/no-unused-prop-types
  onItemMoved: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
};

const ListItemDefaultProps = {
  isEditing: false,
  isLargeRow: false,
  isExpandable: false,
  onExpand: () => {},
  isSelectable: false,
  onSelect: () => {},
  selected: false,
  expanded: false,
  secondaryValue: null,
  rowActions: [],
  icon: null,
  iconPosition: 'left',
  nestingLevel: null,
  isCategory: false,
  i18n: {
    expand: 'Expand',
    close: 'Close',
  },
  selectedItemRef: null,
};

const ItemType = 'ListItem';

const ListItem = ({
  id,
  isEditing,
  isLargeRow,
  isExpandable,
  onExpand,
  expanded,
  isSelectable,
  onSelect,
  selected,
  value,
  secondaryValue,
  rowActions,
  icon,
  iconPosition, // or "right"
  onItemMoved,
  nestingLevel,
  isCategory,
  i18n,
  isDragging,
  selectedItemRef,
  connectDragSource,
  connectDropTarget,
}) => {
  const handleExpansionClick = () => isExpandable && onExpand(id);

  const renderNestingOffset = () =>
    nestingLevel > 0 ? (
      <div
        className={`${iotPrefix}--list-item--nesting-offset`}
        style={{ width: `${nestingLevel * 30}px` }}
      >
        &nbsp;
      </div>
    ) : null;

  const renderExpander = () =>
    isExpandable ? (
      <div
        role="button"
        tabIndex={0}
        className={`${iotPrefix}--list-item--expand-icon`}
        onClick={handleExpansionClick}
        onKeyPress={({ key }) => key === 'Enter' && handleExpansionClick()}
      >
        {expanded ? (
          <ChevronUp16 aria-label={i18n.expand} />
        ) : (
          <ChevronDown16 aria-label={i18n.close} />
        )}
      </div>
    ) : null;

  const renderIcon = () =>
    icon ? (
      <div
        className={`${iotPrefix}--list-item--content--icon ${iotPrefix}--list-item--content--icon__${iconPosition}`}
      >
        {icon}
      </div>
    ) : null;

  const renderRowActions = () =>
    rowActions && rowActions.length > 0 ? (
      <div className={`${iotPrefix}--list-item--content--row-actions`}>{rowActions}</div>
    ) : null;

  const dragIcon = () =>
    isEditing ? (
      <Draggable16
        className={classnames(`${iotPrefix}--list-item--handle`)}
        data-testid="list-item-editable"
      />
    ) : null;

  return (
    <ListItemWrapper
      isPreview={false}
      {...{
        id,
        isSelectable,
        selected,
        isDragging,
        isEditing,
        isLargeRow,
        onSelect,
        connectDragSource,
        connectDropTarget,
        onItemMoved,
      }}
    >
      {renderNestingOffset()}
      {renderExpander()}
      <div
        className={classnames(
          `${iotPrefix}--list-item--content`,
          { [`${iotPrefix}--list-item--content__selected`]: selected },
          { [`${iotPrefix}--list-item--content__large`]: isLargeRow }
        )}
        ref={selectedItemRef}
      >
        {dragIcon()}
        {renderIcon()}
        <div
          className={classnames(`${iotPrefix}--list-item--content--values`, {
            [`${iotPrefix}--list-item--content--values__large`]: isLargeRow,
          })}
        >
          {isLargeRow ? (
            <>
              <div
                className={`${iotPrefix}--list-item--content--values--main ${iotPrefix}--list-item--content--values--main__large`}
              >
                <div
                  className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                    [`${iotPrefix}--list-item--category`]: isCategory,
                    [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                      rowActions
                    ),
                  })}
                  title={value}
                >
                  {value}
                </div>
                {renderRowActions()}
              </div>
              {secondaryValue ? (
                <div
                  title={secondaryValue}
                  className={classnames(
                    `${iotPrefix}--list-item--content--values--value`,
                    `${iotPrefix}--list-item--content--values--value__large`,
                    {
                      [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                        rowActions
                      ),
                    }
                  )}
                >
                  {secondaryValue}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className={`${iotPrefix}--list-item--content--values--main`}>
                <div
                  className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                    [`${iotPrefix}--list-item--category`]: isCategory,
                    [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                      rowActions
                    ),
                  })}
                  title={value}
                >
                  {value}
                </div>
                {secondaryValue ? (
                  <div
                    title={secondaryValue}
                    className={classnames(`${iotPrefix}--list-item--content--values--value`, {
                      [`${iotPrefix}--list-item--content--values--value__with-actions`]: !isEmpty(
                        rowActions
                      ),
                    })}
                  >
                    {secondaryValue}
                  </div>
                ) : null}
                {renderRowActions()}
              </div>
            </>
          )}
        </div>
      </div>
    </ListItemWrapper>
  );
};

const cardSource = {
  /**
   * Implements the drag source contract.
   */
  beginDrag(props) {
    return {
      id: props.columnId,
      index: props.index,
    };
  },
};

const cardTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves

    if (dragIndex === hoverIndex) {
      return;
    }
    props.onItemMoved(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex; // eslint-disable-line no-param-reassign
  },
};

const ds = DragSource(ItemType, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}));

const dt = DropTarget(ItemType, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}));

ListItemWrapper.propTypes = ListItemWrapperProps;
ListItem.propTypes = ListItemPropTypes;
ListItem.defaultProps = ListItemDefaultProps;

export { ListItem as UnconnectedListItem };
export default ds(dt(ListItem));
