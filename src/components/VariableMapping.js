
import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

// Prevents browser from selecting text
// When reorganizing mappings
const noSelectStyle = {
  webkitTouchCallout: 'none', /* iOS Safari */
  webkitUserSelect: 'none', /* Safari */
  khtmlUserSelect: 'none', /* Konqueror HTML */
  mozUserSelect: 'none', /* Firefox */
  msUserSelect: 'none', /* Internet Explorer/Edge */
  userSelect: 'none', /* Non-prefixed version, currently */
  padding: '5px 10px 5px 10px',
  cursor: 'pointer'
}

const vectorDisplayStyle = {
  textAlign: 'center',
  fontSize: '20px',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap'
}

const SortableItem = SortableElement(({ value }) =>
  <span style={noSelectStyle}>{value}</span>
)

const SortableVector = SortableContainer(({ items }) => {
  return (
    <div>
    [&nbsp;{items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}&nbsp;]
    </div>
  )
})

class VariableMappingCard extends Component {
  state = {
    items: ['out', 'sym_1', 'y', 'sym_2', 'sym_3']
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      items: arrayMove(this.state.items, oldIndex, newIndex)
    })
  };

  render () {
    return (
      <Card>
        <CardTitle
          title="Variable Mapping"
          subtitle="The sequence of variable mapping defines the layout of vectors used in the R1CS.  (Drag and drop to reorganize and see changes propagate)"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          For more information, check out <a href="https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649">Vitalik's Post</a> under the section <strong>'Gates to R1CS'</strong>
        </CardText>
        <CardText style={vectorDisplayStyle}>
          <SortableVector items={this.state.items} onSortEnd={this.onSortEnd} axis='x' />
        </CardText>
      </Card>
    )
  }
}

export default VariableMappingCard
