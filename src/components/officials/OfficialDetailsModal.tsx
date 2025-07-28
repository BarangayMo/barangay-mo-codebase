"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Phone, Mail, Award, User } from "lucide-react"

interface OfficialDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  official: any
  onSave: (data: any) => void
  isEditing?: boolean
  isLoading?: boolean
}

const positions = [
  "Punong Barangay",
  "Barangay Secretary",
  "Barangay Treasurer",
  "Sangguniang Barangay Member",
  "SK Chairman",
  "SK Secretary",
  "SK Treasurer",
  "Barangay Health Worker",
  "Barangay Tanod",
  "Barangay Nutrition Scholar",
]

export function OfficialDetailsModal({
  isOpen,
  onClose,
  official,
  onSave,
  isEditing = false,
  isLoading = false,
}: OfficialDetailsModalProps) {
  const [formData, setFormData] = useState({
    position: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    contact_phone: "",
    contact_email: "",
    term_start: "",
    term_end: "",
    status: "active",
    achievements: "",
    years_of_service: 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (official) {
      setFormData({
        position: official.position || "",
        firstName: official.firstName || official.first_name || "",
        middleName: official.middleName || official.middle_name || "",
        lastName: official.lastName || official.last_name || "",
        suffix: official.suffix || "",
        contact_phone: official.contact_phone || "",
        contact_email: official.contact_email || "",
        term_start: official.term_start || "",
        term_end: official.term_end || "",
        status: official.status || "active",
        achievements: official.achievements || "",
        years_of_service: official.years_of_service || 0,
      })
    }
  }, [official])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.position) {
      newErrors.position = "Position is required"
    }
    if (formData.contact_email && !/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = "Invalid email format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSave(formData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const isReadOnly = official?.readOnly
  const isRegionalOfficial = official?.id?.includes("REGION")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isReadOnly ? "Official Details" : isEditing ? "Edit Official" : "Add New Official"}
          </DialogTitle>
        </DialogHeader>

        {isReadOnly ? (
          // Read-only view
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src={official.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-red-100 text-red-600 text-lg">
                  {formData.firstName?.[0]}
                  {formData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {formData.firstName} {formData.middleName} {formData.lastName} {formData.suffix}
                </h3>
                <p className="text-gray-600">{formData.position}</p>
                <Badge variant={formData.status === "active" ? "default" : "secondary"}>{formData.status}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{formData.contact_phone}</span>
                </div>
              )}
              {formData.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{formData.contact_email}</span>
                </div>
              )}
              {formData.term_start && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span>
                    Term: {formData.term_start} - {formData.term_end || "Present"}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-500" />
                <span>{formData.years_of_service} years of service</span>
              </div>
            </div>

            {formData.achievements && (
              <div>
                <h4 className="font-medium mb-2">Achievements</h4>
                <p className="text-gray-600">{formData.achievements}</p>
              </div>
            )}

            {isRegionalOfficial && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">This is a regional official record and cannot be modified.</p>
              </div>
            )}
          </div>
        ) : (
          // Edit/Add form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="suffix">Suffix</Label>
                <Input
                  id="suffix"
                  value={formData.suffix}
                  onChange={(e) => handleInputChange("suffix", e.target.value)}
                  placeholder="Jr., Sr., III, etc."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                  <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-sm text-red-500 mt-1">{errors.position}</p>}
              </div>

              <div>
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>

              <div>
                <Label htmlFor="contact_email">Email Address</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  className={errors.contact_email ? "border-red-500" : ""}
                />
                {errors.contact_email && <p className="text-sm text-red-500 mt-1">{errors.contact_email}</p>}
              </div>

              <div>
                <Label htmlFor="term_start">Term Start</Label>
                <Input
                  id="term_start"
                  type="date"
                  value={formData.term_start}
                  onChange={(e) => handleInputChange("term_start", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="term_end">Term End</Label>
                <Input
                  id="term_end"
                  type="date"
                  value={formData.term_end}
                  onChange={(e) => handleInputChange("term_end", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="years_of_service">Years of Service</Label>
                <Input
                  id="years_of_service"
                  type="number"
                  min="0"
                  value={formData.years_of_service}
                  onChange={(e) => handleInputChange("years_of_service", Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange("achievements", e.target.value)}
                  placeholder="Notable achievements, awards, or accomplishments..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update Official" : "Add Official"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
