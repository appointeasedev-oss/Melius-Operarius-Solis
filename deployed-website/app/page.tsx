"use client"

import { FormEvent, useEffect, useState } from "react"
import HeroSection from "../hero-section"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"
import { Timeline } from "@/components/ui/timeline"
import "./globals.css"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import Chatbot from "../components/chatbot"
import Footer from "../components/footer"
import { content } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true }
}

const HEHO_DATABASE_MANAGE_URL = "https://heho.vercel.app/api/v1/database/manage"
const HEHO_API_KEY = "heho_71bade8d9d5ef6d0a8f6a82e"
const PANTRY_ID = "960c38e3-0953-4d96-99b2-21614c2e43e0"
const PANTRY_BASE_URL = `https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket`

type Product = {
  id: number
  product_name: string
  use: string
  price: number | string
}

type PrintingPrice = {
  id: number
  print_size: string
  description: string
  price_per_print: number | string
}

type LeadFormData = {
  name: string
  phone_number: string
  email: string
  project_description: string
}

type AboutBucket = {
  title: string
  statement: string
}

type FlowBucket = {
  title: string
  subtitle: string
  timeline: {
    id: number
    image: string
    alt: string
    title: string
    description: string
    layout: "left" | "right"
  }[]
}

type ImagesBucket = {
  heroSlides: { image: string; alt: string }[]
  timelineImages: { id: number; image: string; alt: string }[]
  joinBackgroundImage: string
  testimonialImages: { tempId: number; imgSrc: string }[]
}

type FooterContactBucket = {
  email: string
  phone: string
}

async function manageDatabase<T>({
  action,
  tableName,
  data,
  id,
  query,
}: {
  action: "read" | "add" | "edit" | "delete"
  tableName: string
  data?: Record<string, unknown>
  id?: number | string
  query?: Record<string, unknown>
}): Promise<T> {
  const response = await fetch(HEHO_DATABASE_MANAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HEHO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, tableName, data, id, query }),
  })

  if (!response.ok) {
    throw new Error(`Failed to ${action} on ${tableName}: ${response.status}`)
  }

  const payload = await response.json()
  return (Array.isArray(payload) ? payload : payload?.data ?? payload) as T
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [printingPrices, setPrintingPrices] = useState<PrintingPrice[]>([])
  const [pricingError, setPricingError] = useState<string>("")
  const [isLoadingPricing, setIsLoadingPricing] = useState<boolean>(true)
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false)
  const [leadStatus, setLeadStatus] = useState<string>("")
  const [aboutContent, setAboutContent] = useState<AboutBucket>(content.mission)
  const [flowContent, setFlowContent] = useState<FlowBucket>(content.community as FlowBucket)
  const [leadForm, setLeadForm] = useState<LeadFormData>({
    name: "",
    phone_number: "",
    email: "",
    project_description: "",
  })

  const missionStatement = aboutContent.statement
  const timelineEntries = flowContent.timeline.map(entry => ({
    ...entry,
    layout: entry.layout as "left" | "right"
  }))

  useEffect(() => {
    async function loadPricingData() {
      try {
        setIsLoadingPricing(true)
        setPricingError("")

        const [productRows, printingRows] = await Promise.all([
          manageDatabase<Product[]>({ action: "read", tableName: "products" }),
          manageDatabase<PrintingPrice[]>({ action: "read", tableName: "printing_price" }),
        ])

        setProducts(Array.isArray(productRows) ? productRows : [])
        setPrintingPrices(Array.isArray(printingRows) ? printingRows : [])
      } catch {
        setPricingError("Unable to load live pricing right now. Showing fallback pricing.")
      } finally {
        setIsLoadingPricing(false)
      }
    }

    loadPricingData()
  }, [])

  useEffect(() => {
    async function syncPantryBuckets() {
      const aboutPayload: AboutBucket = {
        title: content.mission.title,
        statement: content.mission.statement,
      }
      const flowPayload: FlowBucket = {
        title: content.community.title,
        subtitle: content.community.subtitle,
        timeline: content.community.timeline.map((entry) => ({
          ...entry,
          layout: entry.layout as "left" | "right",
        })),
      }
      const imagesPayload: ImagesBucket = {
        heroSlides: content.hero.slides.map((slide) => ({
          image: slide.image,
          alt: slide.alt,
        })),
        timelineImages: content.community.timeline.map((item) => ({
          id: item.id,
          image: item.image,
          alt: item.alt,
        })),
        joinBackgroundImage: content.join.backgroundImage,
        testimonialImages: content.testimonials.list.map((item) => ({
          tempId: item.tempId,
          imgSrc: item.imgSrc,
        })),
      }
      const footerContactPayload: FooterContactBucket = {
        email: content.footer.contact.email,
        phone: content.footer.contact.phone,
      }

      const readBucket = async <T,>(bucketName: string, fallback: T): Promise<T> => {
        const response = await fetch(`${PANTRY_BASE_URL}/${bucketName}`)
        if (!response.ok) {
          return fallback
        }
        return (await response.json()) as T
      }

      try {
        const [aboutBucket, flowBucket, imagesBucket, footerContactBucket] = await Promise.all([
          readBucket<AboutBucket>("about", aboutPayload),
          readBucket<FlowBucket>("flow", flowPayload),
          readBucket<ImagesBucket>("images", imagesPayload),
          readBucket<FooterContactBucket>("footer-contact", footerContactPayload),
        ])

        setAboutContent(aboutBucket)
        setFlowContent(flowBucket)

        if (imagesBucket.heroSlides?.length) {
          content.hero.slides = imagesBucket.heroSlides
        }

        if (imagesBucket.joinBackgroundImage) {
          content.join.backgroundImage = imagesBucket.joinBackgroundImage
        }

        if (imagesBucket.timelineImages?.length) {
          content.community.timeline = content.community.timeline.map((item) => {
            const fromBucket = imagesBucket.timelineImages.find((image) => image.id === item.id)
            return fromBucket ? { ...item, image: fromBucket.image, alt: fromBucket.alt } : item
          })
        }

        if (imagesBucket.testimonialImages?.length) {
          content.testimonials.list = content.testimonials.list.map((item) => {
            const fromBucket = imagesBucket.testimonialImages.find((image) => image.tempId === item.tempId)
            return fromBucket ? { ...item, imgSrc: fromBucket.imgSrc } : item
          })
        }

        if (footerContactBucket.email) {
          content.footer.contact.email = footerContactBucket.email
        }

        if (footerContactBucket.phone) {
          content.footer.contact.phone = footerContactBucket.phone
        }
      } catch {
        setAboutContent(aboutPayload)
        setFlowContent(flowPayload)
      }
    }

    syncPantryBuckets()
  }, [])

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmittingLead(true)
    setLeadStatus("")

    try {
      await manageDatabase({
        action: "add",
        tableName: "leads",
        data: {
          name: leadForm.name,
          phone_number: leadForm.phone_number,
          email: leadForm.email,
          project_description: leadForm.project_description,
        },
      })

      setLeadStatus("Thanks! Your request has been submitted.")
      setLeadForm({
        name: "",
        phone_number: "",
        email: "",
        project_description: "",
      })
    } catch {
      setLeadStatus("We couldn't submit your request. Please try again.")
    } finally {
      setIsSubmittingLead(false)
    }
  }

  const garmentRows = products.length > 0
    ? products.map((item) => ({
        product: item.product_name,
        description: item.use,
        price: item.price,
      }))
    : content.pricing.garments

  const printingRows = printingPrices.length > 0
    ? printingPrices.map((item) => ({
        size: item.print_size,
        description: item.description,
        price: item.price_per_print,
      }))
    : content.pricing.printing.map((item) => ({
        ...item,
        description: "",
      }))

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Mission Statement Section with Grid Background */}
      <section id="mission" className="relative min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: 'var(--background)' }}>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div className="max-w-4xl mx-auto text-center" {...fadeInUp}>
            <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-12 text-gray-900">{aboutContent.title}</h2>
            <TextGradientScroll
              text={missionStatement}
              className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-800"
              type="word"
              textOpacity="soft"
            />
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="community" className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <motion.div className="text-center" {...fadeInUp}>
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">{flowContent.title}</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                {flowContent.subtitle}
              </p>
            </motion.div>
          </div>

          <Timeline entries={timelineEntries} />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
              {content.pricing.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content.pricing.subtitle}
            </p>
          </motion.div>

          <div className="space-y-16 max-w-5xl mx-auto">
            {/* Garment Blanks */}
            <motion.div {...fadeInUp}>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-gray-900 pl-4">1. Garment Blanks</h3>
              {isLoadingPricing && <p className="text-sm text-gray-500 mb-3">Loading live pricing...</p>}
              {pricingError && <p className="text-sm text-amber-700 mb-3">{pricingError}</p>}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold">Product</TableHead>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold text-right">Price (INR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {garmentRows.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right font-bold">₹{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </motion.div>

            {/* Printing Charges */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeInUp}>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-gray-900 pl-4">2. Printing Charges</h3>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-bold">Print Size</TableHead>
                        <TableHead className="font-bold">Details</TableHead>
                        <TableHead className="font-bold text-right">Price (INR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {printingRows.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">{item.size}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right font-bold">
                            {item.price === "Free" ? <span className="text-green-600">Free</span> : `₹${item.price}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>

              <motion.div {...fadeInUp}>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-gray-900 pl-4">3. Packaging & Branding</h3>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-bold">Option</TableHead>
                        <TableHead className="font-bold text-right">Price (INR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {content.pricing.packaging.map((item, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium">
                            {item.option}
                            {item.notes && <span className="block text-xs text-gray-500 font-normal">{item.notes}</span>}
                          </TableCell>
                          <TableCell className="text-right font-bold">₹{item.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </motion.div>
            </div>

            {/* Operations Fees */}
            <motion.div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl" {...fadeInUp}>
              <h3 className="text-2xl font-bold mb-6">4. Operations & Order Management</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {content.pricing.operations.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-sm text-gray-400 mb-2">{item.tier}</div>
                    <div className="text-2xl font-black">{item.price}</div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-6 text-gray-400 text-sm italic">
                * Applied per product, per order processed. Free non-customized thank-you card included with every order.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
              {content.testimonials.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              {content.testimonials.subtitle}
            </p>
          </motion.div>

          <StaggerTestimonials />
        </div>
      </section>

      <section id="lead-form" className="relative py-20" style={{ backgroundColor: "var(--background)" }}>
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-sm border">
            <h3 className="text-3xl md:text-4xl font-black tracking-wide text-gray-900 mb-3">Start Your Project</h3>
            <p className="text-gray-600 mb-8">
              Share your requirements and we will reach out with pricing and production guidance.
            </p>
            <form className="space-y-5" onSubmit={handleLeadSubmit}>
              <div>
                <label htmlFor="lead-name" className="text-sm font-medium text-gray-700">Name</label>
                <Input
                  id="lead-name"
                  required
                  value={leadForm.name}
                  onChange={(event) => setLeadForm((previous) => ({ ...previous, name: event.target.value }))}
                  placeholder="Your full name"
                  className="mt-2"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="lead-phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    id="lead-phone"
                    required
                    value={leadForm.phone_number}
                    onChange={(event) => setLeadForm((previous) => ({ ...previous, phone_number: event.target.value }))}
                    placeholder="+91..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <label htmlFor="lead-email" className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    id="lead-email"
                    type="email"
                    required
                    value={leadForm.email}
                    onChange={(event) => setLeadForm((previous) => ({ ...previous, email: event.target.value }))}
                    placeholder="you@example.com"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lead-project" className="text-sm font-medium text-gray-700">Project Description</label>
                <Textarea
                  id="lead-project"
                  required
                  value={leadForm.project_description}
                  onChange={(event) => setLeadForm((previous) => ({ ...previous, project_description: event.target.value }))}
                  placeholder="Tell us about your products, quantities, and design needs..."
                  className="mt-2 min-h-28"
                />
              </div>
              <Button type="submit" disabled={isSubmittingLead} className="w-full md:w-auto">
                {isSubmittingLead ? "Submitting..." : "Submit Lead"}
              </Button>
              {leadStatus && <p className="text-sm text-gray-700">{leadStatus}</p>}
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Chatbot />
    </div>
  )
}
