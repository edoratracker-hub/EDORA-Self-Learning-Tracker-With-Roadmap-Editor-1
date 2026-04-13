import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { PaperclipIcon, SendIcon } from 'lucide-react'
import React from 'react'

export const ExploreInputSection = () => {
    return (
        <div className="sticky bottom-6 z-50 mx-auto w-full bg-background/80 backdrop-blur-md border rounded-2xl p-2 shadow-lg">
            <InputGroup className="w-full py-6">
                <InputGroupAddon align="inline-start">
                    <InputGroupButton variant="outline">
                        <PaperclipIcon />
                    </InputGroupButton>
                </InputGroupAddon>
                <InputGroupInput placeholder="Share something..." />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="outline">
                        <SendIcon />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}
