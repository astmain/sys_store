/// <reference types="vite/client" />

declare module "vue-drag-resize/src" {
  import { DefineComponent } from "vue"
  const VueDragResize: DefineComponent<any, any, any>
  export default VueDragResize
}

import type { CSSProperties } from "vue"

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    ElTable: {
      style?: string | CSSProperties
      [key: string]: any
    } & import("vue").ComponentPublicInstance
  }
}