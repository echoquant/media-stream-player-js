import React, { Ref } from 'react'
import {
  Sdp,
  Html5VideoPipeline,
  Html5CanvasPipeline,
  HttpMsePipeline,
  TransformationMatrix,
  Rtcp,
} from 'media-stream-library'

import { WsRtspVideo } from './WsRtspVideo'
import { MetadataHandler } from './metadata'
import { Format } from './types'

export type PlayerNativeElement =
  | HTMLVideoElement
  | HTMLCanvasElement
  | HTMLImageElement

export type PlayerPipeline =
  | Html5VideoPipeline
  | Html5CanvasPipeline
  | HttpMsePipeline

export enum AxisApi {
  'AXIS_IMAGE_CGI' = 'AXIS_IMAGE_CGI',
  'AXIS_MEDIA_AMP' = 'AXIS_MEDIA_AMP',
  'AXIS_MEDIA_CGI' = 'AXIS_MEDIA_CGI',
}

export enum Protocol {
  'HTTP' = 'http:',
  'HTTPS' = 'https:',
  'WS' = 'ws:',
  'WSS' = 'wss:',
}

export const FORMAT_API: Record<Format, AxisApi> = {
  RTP_H264: AxisApi.AXIS_MEDIA_AMP,
  RTP_JPEG: AxisApi.AXIS_MEDIA_AMP,
  MP4_H264: AxisApi.AXIS_MEDIA_CGI,
  JPEG: AxisApi.AXIS_IMAGE_CGI,
}

export interface VapixParameters {
  readonly [key: string]: string
}

export type Range = readonly [number | undefined, number | undefined]

export interface VideoProperties {
  readonly el: PlayerNativeElement
  readonly width: number
  readonly height: number
  readonly formatSupportsAudio: boolean
  readonly pipeline?: PlayerPipeline
  readonly media?: ReadonlyArray<{
    readonly type: 'video' | 'audio' | 'data'
    readonly mime: string
  }>
  readonly volume?: number
  readonly range?: Range
  readonly sensorTm?: TransformationMatrix
}

interface PlaybackAreaProps {
  readonly forwardedRef?: Ref<PlayerNativeElement>
  readonly host: string
  readonly wsproxy: string
  readonly rtspurl: string
  readonly format: Format
  readonly parameters?: VapixParameters
  readonly play?: boolean
  readonly offset?: number
  readonly refresh: number
  readonly onPlaying: (properties: VideoProperties) => void
  readonly onEnded?: () => void
  readonly onSdp?: (msg: Sdp) => void
  readonly onRtcp?: (msg: Rtcp) => void
  readonly metadataHandler?: MetadataHandler
  readonly secure?: boolean
  /**
   * Activate automatic retries on RTSP errors.
   */
  readonly autoRetry?: boolean
}

export const WsRtspPlaybackArea: React.FC<PlaybackAreaProps> = ({
  forwardedRef,
  wsproxy,
  rtspurl,
  format,
  play,
  offset,
  refresh,
  onPlaying,
  onEnded,
  onSdp,
  onRtcp,
  metadataHandler,
  secure = window.location.protocol === Protocol.HTTPS,
  autoRetry = false,
}) => {
  console.log(`playing ${rtspurl} -> ${wsproxy}`)
  if (format === Format.RTP_H264) {
    const rtsp = rtspurl
    let ws = ''
    if (rtsp) {
      const url = new URL(rtsp)
      const rtsp_host = url.hostname
      const rtsp_port = url.port || '554'

      const ws_proto = secure ? Protocol.WSS : Protocol.WS
      const ws_proxy = wsproxy
        ? wsproxy
        : `${window.location.hostname}:${window.location.port}`
      ws = `${ws_proto}//${ws_proxy}/websockify/?ip=${rtsp_host}&port=${rtsp_port}`
    }

    return (
      <WsRtspVideo
        key={refresh}
        forwardedRef={forwardedRef as Ref<HTMLVideoElement>}
        {...{
          ws,
          rtsp,
          play,
          offset,
          onPlaying,
          onEnded,
          onSdp,
          onRtcp,
          metadataHandler,
          autoRetry,
        }}
      />
    )
  }

  console.warn(`Error: unknown format: ${format},
please use one of ${[
    Format.RTP_H264,
    Format.JPEG,
    Format.MP4_H264,
    Format.RTP_JPEG,
  ].join(', ')}`)

  return null
}
