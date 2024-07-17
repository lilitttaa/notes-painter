import logo from './logo.svg'
import './App.css'

import * as d3 from 'd3'
// import { SVG } from 'react-svg';
import { useEffect } from 'react'

export function D3ReactTree({ id }) {
  const data = {
    name: 'FromMainToBeginPlay',
    children: [
      {
        name: 'PreInit',
        children: [
          {
            name: 'PreInitPreStartupScreen', children: [
              {
                name: "FEngineLoop::LoadPreInitModules",
                value: 1,
              },
              {
                name: " FEngineLoop::AppInit()",
                children: [
                  {
                    name: "EarliestPossible",
                    value: 1,
                    color: 'green'
                  },
                  {
                    name: "PostConfigInit",
                    value: 1,
                    color: 'green'
                  }
                ]
              },
            ]
          },
          { name: 'PreInitPostStartupScreen', value: 1 },
        ]
      },
      {
        name: 'Init',
        children: []
      },
      {
        name: 'Loop',
        children: []
      },
      {
        name: 'Exit',
        children: []
      }
    ]
  }
  const w = 1000
  const h = 600
  const geneateTree = () => {
    // Specify the chart’s dimensions.
    const format = d3.format(',d')
    // Create a color scale (a color for each child of the root node and their descendants).
    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    )
    const colorRed = '#ff0000'
    const colorGreen = '#00ff00'
    const colorBlue = '#0000ff'
    const colorPurple = '#800080'
    const colorGray = '#ccc'

    // Create a partition layout.
    const partition = d3.partition().size([h, w]).padding(1)

    // Apply the partition layout.
    const root = partition(
      d3
        .hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.height - a.height || b.value - a.value)
    )

    // Create the SVG container.
    const svg = d3
      .select('#' + id)
      .append('svg')
      .attr('width', w)
      .attr('height', h)
      .attr('viewBox', [0, 0, w, h])
      .attr('style', 'max-width: 100%; height: auto; font: 10px sans-serif')

    // Add a cell for each node of the hierarchy.
    const cell = svg
      .selectAll()
      .data(root.descendants())
      .join('g')
      .attr('transform', d => `translate(${d.y0},${d.x0})`)

    cell.append('title').text(
      d =>
        `${d
          .ancestors()
          .map(d => d.data.name)
          .reverse()
          .join('/')}\n${format(d.value)}`
    )

    // Color the cell with respect to which child of root it belongs to.
    cell
      .append('rect')
      .attr('width', d => d.y1 - d.y0)
      .attr('height', d => d.x1 - d.x0)
      .attr('fill-opacity', 0.6)
      .attr('fill', d => {
        if(d.data.color && d.data.color === 'green') return colorPurple
        return colorGray
      })

    // Add labels and a title.
    const text = cell
      .filter(d => d.x1 - d.x0 > 16)
      .append('text')
      .attr('x', 4)
      .attr('y', 13)

    text.append('tspan').text(d => d.data.name)
  }

  useEffect(() => {
    geneateTree()
  }, [])

  return <div id={id} width={w} height={h}></div>
}

function App() {
  return (
    <div className='App'>
      <div>
        <D3ReactTree id='d3-tree' />
      </div>
    </div>
  )
}

export default App
