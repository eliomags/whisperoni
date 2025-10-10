"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { usePosts } from "@/lib/posts-context"
import { Filter, Search } from "lucide-react"

export function PostFilters() {
  const { filters, setFilters } = usePosts()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-filter" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Label>
          <Input
            id="search-filter"
            placeholder="Search posts, names, or keywords..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          {filters.search && (
            <p className="text-xs text-muted-foreground">
              Searching in post content, user names, and locations
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender-filter">Gender</Label>
          <Select
            value={filters.gender || "all"}
            onValueChange={(value) => setFilters({ ...filters, gender: value as any })}
          >
            <SelectTrigger id="gender-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orientation-filter">Orientation</Label>
          <Select
            value={filters.orientation || "all"}
            onValueChange={(value) => setFilters({ ...filters, orientation: value as any })}
          >
            <SelectTrigger id="orientation-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="straight">Straight</SelectItem>
              <SelectItem value="gay">Gay</SelectItem>
              <SelectItem value="bisexual">Bisexual</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location-filter">Location</Label>
          <Input
            id="location-filter"
            placeholder="Search by location..."
            value={filters.location || ""}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
