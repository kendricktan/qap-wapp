import React from 'react'
import { Row, Col } from 'react-flexbox-grid'

const displayVector = (v, spacingNo = 1) => {
  return v.reduce((acc, s, i) => acc + s + ((i === v.length - 1) ? '' : ' '.repeat(Math.max(1, spacingNo - (s + '').length + 1))), '[ ') + ' ]'
}

const displayMatrix = (m, dynamicSpacing = true) => {
  // Pretify vectors to have the same spacing
  // Gets max digit length
  const mdl = dynamicSpacing ? m.reduce((a, v) => Math.max(a, v.reduce((b, s) => Math.max(b, (s + '').length), 1)), 1) : 1

  // Slice 1 to remove first newline
  return m.reduce((acc, s) => acc + '\n' + displayVector(s, mdl), '').slice(1)
}

const displayEquation = (a, b) => {
  // Where a = b
  return (
    <Row center='xs' style={{ fontFamily: '"Lucida Console", Monaco, monospace' }}>
      <Col xs={4} style={{ textAlign: 'right' }}>{a}</Col>
      <Col xs={1} style={{ textAlign: 'center' }}>=</Col>
      <Col xs={4} style={{ textAlign: 'left' }}>{b}</Col>
    </Row>
  )
}

export {
  displayEquation,
  displayVector,
  displayMatrix
}
