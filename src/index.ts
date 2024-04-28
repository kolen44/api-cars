import csv from 'csv-parser'
import fs from 'fs'

type TableLine = {
	article: string
	in_stock: number
	detail_name: string
	included_in_unit?: string
	brand: string
	model: string
	version: number
	body_type: string
	year: number
	engine: string
	volume: string
	engine_type?: string
	gearbox: string
	original_number?: string
	price: number
	for_naked?: string
	currency: string
	discount: number
	description: string
	year_start_production: number
	year_end_production: number
	url_photo_details: string
	url_car_photo: string
	video?: string
	phone: string
	vin: string
}

class CsvToJson {
	public createObjectByArray(arr: string[]): TableLine {
		const object: Partial<TableLine> = {}
		let index = 0

		const keys = [
			'article',
			'in_stock',
			'detail_name',
			'included_in_unit',
			'brand',
			'model',
			'version',
			'body_type',
			'year',
			'engine',
			'volume',
			'engine_type',
			'gearbox',
			'original_number',
			'price',
			'for_naked',
			'currency',
			'discount',
			'description',
			'year_start_production',
			'year_end_production',
			'url_photo_details',
			'url_car_photo',
			'video',
			'phone',
			'vin',
		] as (keyof TableLine)[]

		const numberKeys = [
			'in_stock',
			'version',
			'year',
			'price',
			'discount',
			'year_start_production',
			'year_end_production',
		] as (keyof TableLine)[]

		keys.forEach(key => {
			const item = arr[index++]
			if (!item) return

			if (numberKeys.includes(key)) {
				try {
					object[key] = +item as unknown as undefined
					return
				} catch (err) {}
			}
			object[key] = item as unknown as undefined
		})

		return object as TableLine
	}

	public lineToTableLine(line: string): TableLine {
		const arr = line.replace(/"/g, '').split(';')
		return this.createObjectByArray(arr)
	}

	public convert(text: string) {
		return text
			.split('"\r\n')
			.slice(1)
			.map(line => this.lineToTableLine(line))
			.slice(undefined, 1000)
	}
}

function main() {
	const spares = fs.readFileSync('data/spares.csv', 'utf8')
	const csvToJson = new CsvToJson()
	const result = csvToJson.convert(spares)
	console.log(result)
	fs.writeFileSync('data/test.json', JSON.stringify(result))
}

function test() {
	// const readStream = fs.createReadStream('data/spares.csv')

	// const writeStream = fs.createWriteStream('data/test.json')

	const csvToJson = new CsvToJson()

	const foo = (obj: Record<string, string>) => {
		let result: Partial<TableLine> = {}

		// value = value.replace(/"/g, '').split(';') as string[]
		result = csvToJson.createObjectByArray(
			Object.values(obj)[0].replace(/"/g, '').split(';')
		)
		// console.log(value, '\n\n\n\n')

		return result as TableLine
	}

	const rows: TableLine[] = []
	fs.createReadStream('data/spares.csv')
		.pipe(csv())
		.on('data', row => {
			rows.push(foo(row))
			// console.log(row)
		})
		.on('end', () => {
			console.log(rows)
			console.log('Чтение CSV файла завершено')
		})
}

test()

// const table = spares.split('\n').map((line) => lineToTableLine(line))

// console.log(table[1])
