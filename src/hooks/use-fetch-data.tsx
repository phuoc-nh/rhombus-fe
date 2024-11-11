import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, Edit2 } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

export default function useFetchData({ page, perPage, params }: any) {
	const [data, setData] = useState<any>()
	const [totalPage, setTotalPage] = useState(0)
	const [columns, setColumns] = useState<any>([])
	const [builtColumns, setBuiltColumns] = useState<any>([])
	const [initialTypes, setInitialTypes] = useState<any>([])

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:8000/api/upload/?file_id=${params.id}&limit=${perPage}&page=${page}`)
			const data = await response.json()
			setData(JSON.parse(data.data))
			setTotalPage(data.total_pages)
			const c = Object.keys(data.types).map((key) => { 
				return {
					key: key,
					type: data.types[key]
				}
			})
			setInitialTypes(data.types)

			setColumns(c)

		}
		fetchData()

	}, [perPage, page])

	useEffect(() => {
		const bcolumns = columns.map((el) => {
			const handleTypeChange = (columnId: string, newType: string) => {
				setColumns(columns.map(col => 
				  col.key === columnId ? { ...col, type: newType } : col
				))

				console.log('xxxxxx', {
					file_id: params.id,
					types: {
						...initialTypes,
						[columnId]: newType
					}
				})

				fetch('http://localhost:8000/api/upload/', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						file_id: params.id,
						types: {
							...initialTypes,
							[columnId]: newType
						}
					})
				}).then((response) => { 
					console.log('update succeeded', response)
				})
			}



			return {
				accessorKey: el.key,
				header: () => (
					<div className="flex items-center justify-between ">
						<div className=''>
							<div className=''>{el.key}</div>
							{/* <div className='bg-red-400' ></div> */}
							<Badge variant={el.type}>{el.type}</Badge>
						</div>
						<div className="flex items-center space-x-2">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<ChevronDown className="h-4 w-4" />
									<span className="sr-only ">Change column type</span>
								</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
								
									<DropdownMenuItem  onClick={() => handleTypeChange(el.key, 'text')}>
										Text
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleTypeChange(el.key, 'number')}>
										Number
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleTypeChange(el.key, 'dateTime')}>
										Date
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleTypeChange(el.key, 'category')}>
										Category
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleTypeChange(el.key, 'boolean')}>
										Boolean
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
				</div>
				)
			}
		})

		setBuiltColumns(bcolumns)

	}, [columns])


	return {
		data,
		totalPage,
		columns: builtColumns
	}
}
