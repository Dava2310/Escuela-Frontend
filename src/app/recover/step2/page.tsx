import { RecoverForm_Step2 } from "@/components/recover-stepTwo-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RecoverForm_Step2 />
      </div>
    </div>
  )
}