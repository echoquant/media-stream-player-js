import React, { ChangeEventHandler, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { VapixParameters } from './PlaybackArea'
import { Switch } from './components/Switch'
import { Format } from './types'

const SettingsMenu = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 32px;
  right: 0;
  background: rgb(0, 0, 0, 0.66);
  padding: 8px 16px;
  margin-bottom: 16px;
  margin-right: 8px;

  &:after {
    content: '';
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    position: absolute;
    bottom: -5px;
    right: 12px;
    background: rgb(0, 0, 0, 0.66);
  }
`

const SettingsItem = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  height: 24px;
  width: 320px;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0;
`

interface SettingsProps {
  readonly parameters: VapixParameters
  readonly format: Format
  readonly onFormat: (format: Format) => void
  readonly onVapix: (key: string, value: string) => void
  readonly showStatsOverlay: boolean
  readonly toggleStats: (newValue?: boolean) => void
}

export const Settings: React.FC<SettingsProps> = ({
  parameters,
  format,
  onFormat,
  onVapix,
  showStatsOverlay,
  toggleStats,
}) => {
  const [textString, setTextString] = useState(parameters['textstring'])
  const textStringTimeout = useRef<number>()

  const changeParam: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const { name, value } = e.target

      switch (name) {
        case 'textstring':
          setTextString(value)

          clearTimeout(textStringTimeout.current)
          textStringTimeout.current = window.setTimeout(() => {
            onVapix(name, value)
          }, 300)

          break

        case 'text':
          onVapix(name, value ? '1' : '0')
          break
        default:
          console.warn('internal error')
      }
    },
    [onVapix],
  )

  const changeStatsOverlay: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => toggleStats(e.target.checked),
    [toggleStats],
  )

  const changeFormat: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => onFormat(e.target.value as Format),
    [onFormat],
  )

  const changeResolution: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => onVapix('resolution', e.target.value),
    [onVapix],
  )

  const changeRotation: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => onVapix('rotation', e.target.value),
    [onVapix],
  )

  const changeCompression: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (e) => onVapix('compression', e.target.value),
    [onVapix],
  )

  return (
    <SettingsMenu>
      <SettingsItem>
        <div>Stats overlay</div>
        <Switch checked={showStatsOverlay} onChange={changeStatsOverlay} />
      </SettingsItem>
    </SettingsMenu>
  )
}
