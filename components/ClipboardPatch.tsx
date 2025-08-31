"use client"

import { useEffect } from "react"

function copyWithExecCommand(text: string) {
  return new Promise<void>((resolve, reject) => {
    try {
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      textarea.style.left = "-9999px"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      textarea.setSelectionRange(0, textarea.value.length)
      const ok = document.execCommand("copy")
      document.body.removeChild(textarea)
      if (ok) resolve()
      else reject(new Error("execCommand copy failed"))
    } catch (err) {
      reject(err as Error)
    }
  })
}

export default function ClipboardPatch() {
  useEffect(() => {
    // Only patch in browsers that expose the Clipboard API
    const clipboard: Clipboard | undefined = (navigator as any)?.clipboard
    if (!clipboard) return

    const original = clipboard.writeText?.bind(clipboard)
    if (!original) return

    const patched = async (text: string) => {
      try {
        await original(text)
      } catch (err: any) {
        const msg = String(err?.message || "")
        const name = String((err as any)?.name || "")
        const isPermissionsPolicy =
          name === "NotAllowedError" || /permissions policy/i.test(msg) || /denied/i.test(msg)
        if (isPermissionsPolicy) {
          return copyWithExecCommand(text)
        }
        throw err
      }
    }

    try {
      Object.defineProperty(clipboard, "writeText", {
        configurable: true,
        value: patched,
      })
    } catch {
      try {
        ;(clipboard as any).writeText = patched
      } catch {
        // If we cannot patch, silently ignore
      }
    }
  }, [])

  return null
}
