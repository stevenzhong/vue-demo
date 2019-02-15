declare module 'vue/types/vue' {
  interface Vue {
    $log(message?: any, ...optionalParams: any[]): void
    $event: Vue
    $unauthorizedBtns: (routes: { [key: string]: any }[], url: string, pageButtons: { [key: string]: number }) => Promise<any>
  }
}

export {}
