'use client'
import { useDataTable } from '@/hooks/use-data-table'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
  } from "@tanstack/react-table"
   
  import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
  } from "@/components/ui/table"
import { DataTablePagination } from '../(components)/data-table-pagination'
import useFetchData from '@/hooks/use-fetch-data'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchParams {
	[key: string]: string | string[] | undefined
}
	interface IndexPageProps {
	searchParams: Promise<SearchParams>
}
export default function page(props: IndexPageProps) {
	const params = useParams()
	const searchParams = useSearchParams()

	const perPage = searchParams.get('perPage') || 10
	const page = searchParams.get('page')  || 1
	const router = useRouter()
	

	const {columns, data, totalPage } = useFetchData({
		page: page,
		perPage: perPage,
		params: params
	})

	if (!params.id) { 
		return <div>Invalid page ID</div>
	}


	const { table } = useDataTable({
		data: data || [],
		columns: columns || [],
		pageCount: totalPage,
		initialState: {
			columnPinning: { right: ["actions"] },
		},
		getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
		shallow: false,
		clearOnDefault: true,
	})




	return (
		<div className="rounded-md border w-full p-10">
			<div>
				<Button variant="ghost" className='mb-5' onClick={() => router.push('/')}>
					<ChevronLeft  />
					Back
				</Button>
			</div>
			<Table>
				<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						return (
						<TableHead key={header.id}>
							{header.isPlaceholder
							? null
							: flexRender(
								header.column.columnDef.header,
								header.getContext()
								)}
						</TableHead>
						)
					})}
					</TableRow>
				))}
				</TableHeader>
				<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
					<TableRow
						key={row.id}
						data-state={row.getIsSelected() && "selected"}
					>
						{row.getVisibleCells().map((cell) => (
						<TableCell key={cell.id}>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</TableCell>
						))}
					</TableRow>
					))
				) : (
					<TableRow>
					<TableCell colSpan={columns.length} className="h-24 text-center">
						No results.
					</TableCell>
					</TableRow>
				)}
				</TableBody>
			</Table>
			<div className="flex flex-col gap-2.5">
				<DataTablePagination table={table} />
				{table.getFilteredSelectedRowModel().rows.length > 0}
			</div>
		</div>
	)
}
