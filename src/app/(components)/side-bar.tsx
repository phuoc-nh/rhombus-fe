'use client'
import React, { use, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { FileText } from 'lucide-react'
import { useFileContext } from '../fileContext'
import Link from 'next/link'

type SideBarProps = {
	children: React.ReactNode
}

interface FileData {
	id: number;
	file: string;
  }
  

export default function SideBar({ children }: SideBarProps) {
	
	const { uploadHistory } = useFileContext();

	return (
		<SidebarProvider>
			<div className="flex h-screen w-screen">
				<Sidebar>
					<SidebarHeader>
						<h2 className="text-lg font-semibold">Upload History</h2>
					</SidebarHeader>
					<SidebarContent>
						{uploadHistory.map((fileName, index) => (
							<Link href={`/${fileName.id}`} key={index} className="flex items-center space-x-2 p-2 cursor-pointer">
								<FileText size={16} />
								<div>{fileName.file}</div>
							</Link>
						))}
							
					</SidebarContent>
				</Sidebar>

				{children}
				
			</div>
		</SidebarProvider>
	)
}
