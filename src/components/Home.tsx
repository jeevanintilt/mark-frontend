import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
        <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
                <CardTitle className="text-2xl">Welcome to the Home Page</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You have successfully logged in!</p>
            </CardContent>
        </Card>
        </div>
    );
}
