import React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


export const UserTypeSelector = ({
    userType,
    setUserType,
    onClickHandler,
}: UserTypeSelectorParams) => {

    //  accessChangeHandler

    const onAccessChange = (type: UserType) => {
        setUserType(type);
        onClickHandler && onClickHandler(type);

    }

    return (
        <Select value={userType} 
            onValueChange={(type: UserType) => onAccessChange(type)} 
        >
            <SelectTrigger className="shad-select">
                <SelectValue  />
            </SelectTrigger>
            <SelectContent className=' border-none bg-dark-200'>
                <SelectItem value="viewer" className='shad-select-item'>
                    Can view
                </SelectItem>
                <SelectItem value="editor" className='shad-select-item'>
                    Can edit
                </SelectItem>
            </SelectContent>
        </Select>

    )
}
