import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronLeft, Menu } from "lucide-react"; // Import icons

export function Home() {
    const [isNavExpanded, setIsNavExpanded] = useState(true);

    return (
        <div className="flex h-screen ">
            {/* Collapsible Left Navigation */}
            <nav className={`bg-gray-100 p-4 transition-all duration-300 ${isNavExpanded ? 'w-64' : 'w-16'}`}>
                <Button 
                    variant="default" 
                    size="icon"
                    onClick={() => setIsNavExpanded(!isNavExpanded)}
                    className="mb-4"
                >
                    {isNavExpanded ? <ChevronLeft /> : <Menu />}
                </Button>
                <ul className="space-y-2">
                    <li>
                        <Button variant="ghost" className={`w-full justify-start ${!isNavExpanded && 'px-0'}`}>
                            {isNavExpanded ? 'Playground' : 'P'}
                        </Button>
                    </li>
                    <li>
                        <Button variant="ghost" className={`w-full justify-start ${!isNavExpanded && 'px-0'}`}>
                            {isNavExpanded ? 'Assets' : 'A'}
                        </Button>
                    </li>
                    <li>
                        <Button variant="ghost" className={`w-full justify-start ${!isNavExpanded && 'px-0'}`}>
                            {isNavExpanded ? 'Inspirations' : 'I'}
                        </Button>
                    </li>
                </ul>
            </nav>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <Avatar>
                                    <AvatarImage src="/avatar.png" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            {/* Add more menu items as needed */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    <Card className="h-full">
                        <div className="p-6">
                            <p>You have successfully logged in!</p>
                            {/* Add more content here */}
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}
