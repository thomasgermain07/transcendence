import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { join } from 'path'
import { createReadStream } from 'fs';
import path = require('path')

const fs = require('fs')
const FileType = require('file-type')

type validFileExtension = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg']
const validMimeTypes: validMimeType[] = [
    'image/png', 
    'image/jpg', 
    'image/jpeg',
]

export const storage = {
	storage: diskStorage({
		destination: './images',
		filename: (req, file, cb) => {
			console.log("------------STORAGE-----------")
			const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
			const extension: string = path.parse(file.originalname).ext;

			cb(null, `${filename}${extension}`)
		}
	}),
	fileFilter: (req, file, cb) => {
		const allowMimeTypes: validMimeType[] = validMimeTypes
		allowMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false)
	}
}

async function checkFileExtension(fullFilePath: string) : Promise<boolean> {
	const fileExtensionAndMimeType = await FileType.fromFile(fullFilePath)
	console.log(fileExtensionAndMimeType)
	if (!fileExtensionAndMimeType) {
		return false;
	}
	const isFileTypeLegit = validFileExtensions.includes(fileExtensionAndMimeType.ext)
	const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.mime)
	console.log(isFileTypeLegit)
	console.log(isMimeTypeLegit)
	if (isFileTypeLegit && isMimeTypeLegit)
		return true
	return false
} 

export const isFileExtensionSafe = (fullFilePath: string): Promise<boolean> => {
	return checkFileExtension(fullFilePath)
}

export const removeFile = (fullFilePath: string): void => {
	try {
		fs.unlinkSync(fullFilePath)
		
	} catch (error) {
		console.log(error)
		
	}
}