"use client"

import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/server/client";
import { useState } from "react";

export default function Page() {
    const [confirm, setconfirm] = useState(false)
    const { data } = trpc.user.getUsers.useQuery()
    const utils = trpc.useUtils()
    const { mutate } = trpc.user.deleteUsers.useMutation({
        onSuccess() {
            utils.user.getUsers.invalidate()
        }
    })
    const { mutate: mutatePromote } = trpc.user.promoteUsers.useMutation({
        onSuccess() {
            utils.user.getUsers.invalidate()
        }
    })
    return (<main className="flex min-h-screen flex-col items-center pt-32">
        {/* Navigation Bar */}
        <Navbar />

        {/* Padding added below Navbar */}
        <div className="mt-4 w-full"></div> {/* Adds margin-top of 1rem (4 * 0.25rem) */}
        <div className="w-full px-4" >
            <Table>
                <TableHeader >
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(data ?? []).map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                {confirm ? (<Button onClick={function () {
                                    mutate({ id: user.id })
                                    setconfirm(false)
                                }} variant={"destructive"}>Are you sure?</Button>) : (<Button onClick={function () {
                                    setconfirm(true)
                                }} variant={"destructive"}>Delete</Button>)}

                                <Button onClick={function () {
                                    mutatePromote({ id: user.id, admin: user.role === "USER" })
                                }}>Change Role</Button></TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </div>
    </main>)
}