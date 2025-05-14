import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"

export function ExampleCard() {
  return (
    <div className="p-6 space-y-breathing">
      <h2 className="text-2xl font-bold mb-4">Design System Examples</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Card</CardTitle>
            <CardDescription>Example of the new design system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Client Name</h4>
              <p className="text-muted-foreground">John Smith</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Service</h4>
              <p className="text-muted-foreground">Hair Cut & Styling</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Status</h4>
              <div className="flex gap-2">
                <StatusBadge status="pending" />
                <StatusBadge status="confirmed" />
                <StatusBadge status="cancelled" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>View and manage service details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Service Name</h4>
              <p className="text-muted-foreground">Premium Haircut</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Duration</h4>
              <p className="text-muted-foreground">45 minutes</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Price</h4>
              <p className="text-muted-foreground">$45.00</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Edit Service</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>Your business operating hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h4 className="font-medium mb-1">Monday</h4>
                <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tuesday</h4>
                <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Wednesday</h4>
                <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Thursday</h4>
                <p className="text-muted-foreground">9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Update Hours
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
