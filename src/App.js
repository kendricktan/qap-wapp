import React, { Component } from 'react'
import { Card } from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import FlattenStep from './components/Flatten'
import GatesToR1CSCard from './components/GatesToR1CS'
import QAPSolutionCard from './components/QAPSolution'
import VariableMappingCard from './components/VariableMapping'
import R1CSToQAPCard from './components/R1CSToQAP'
import './styles/app.css'

class App extends Component {
  render () {
    return (
      <div>
        <AppBar
          showMenuIconButton={false}
          title="QAP Playground"
        />
        <div style={{ margin: '20px auto 20px auto', maxWidth: '1000px' }}>
          <Card>
            <FlattenStep />
          </Card>
        </div>
      </div>
    )
  }
}

export default App
