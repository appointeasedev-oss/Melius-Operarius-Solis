"use client"

import HeroSection from "../hero-section"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"
import { Timeline } from "@/components/ui/timeline"
import "./globals.css"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import Chatbot from "../components/chatbot"
import Footer from "../components/footer"
import { content } from "@/lib/content"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Page() {
  const missionStatement = content.mission.statement
  const timelineEntries = content.community.timeline.map(entry => ({
    ...entry,
    layout: entry.layout as "left" | "right"
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
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-12 text-gray-900">{content.mission.title}</h2>
            <TextGradientScroll
              text={missionStatement}
              className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-800"
              type="word"
              textOpacity="soft"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="community" className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">{content.community.title}</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                {content.community.subtitle}
              </p>
            </div>
          </div>

          <Timeline entries={timelineEntries} />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
              {content.pricing.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content.pricing.subtitle}
            </p>
          </div>

          <div className="space-y-16 max-w-5xl mx-auto">
            {/* Garment Blanks */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-gray-900 pl-4">1. Garment Blanks</h3>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold">Product</TableHead>
                      <TableHead className="font-bold">Description</TableHead>
                      <TableHead className="font-bold">Size Range</TableHead>
                      <TableHead className="font-bold text-right">Price (INR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.pricing.garments.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell className="text-right font-bold">₹{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Printing Charges */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-800 border-l-4 border-gray-900 pl-4">2. Printing Charges</h3>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-bold">Print Size</TableHead>
                        <TableHead className="font-bold text-right">Price (INR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {content.pricing.printing.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.size}</TableCell>
                          <TableCell className="text-right font-bold">
                            {item.price === "Free" ? <span className="text-green-600">Free</span> : `₹${item.price}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div>
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
                        <TableRow key={idx}>
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
              </div>
            </div>

            {/* Operations Fees */}
            <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6">4. Operations & Order Management</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {content.pricing.operations.map((item, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">{item.tier}</div>
                    <div className="text-2xl font-black">{item.price}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-gray-400 text-sm italic">
                * Applied per product, per order processed. Free non-customized thank-you card included with every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20" style={{ backgroundColor: 'var(--background)' }}>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
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

      <Footer />
      <Chatbot />
    </div>
  )
}
