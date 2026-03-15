"use client"

import { motion } from "framer-motion"
import { Instagram, Twitter, Facebook, MapPin, Mail, Phone } from "lucide-react"
import { content } from "@/lib/content"

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-200">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <h3 className="text-3xl md:text-4xl font-black tracking-wider text-gray-900 mb-4">{content.brand.fullName}</h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-md">
              {content.brand.description}
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href={content.footer.social.instagram}
                className="w-12 h-12 bg-gray-900 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={content.footer.social.twitter}
                className="w-12 h-12 bg-gray-900 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={content.footer.social.facebook}
                className="w-12 h-12 bg-gray-900 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">QUICK LINKS</h4>
            <ul className="space-y-3">
              {content.footer.quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-bold text-gray-900 mb-6 tracking-wide">GET IN TOUCH</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-gray-600" />
                <span className="text-gray-600 font-medium">{content.footer.contact.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-600" />
                <a
                  href={`mailto:${content.footer.contact.email}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                >
                  {content.footer.contact.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-600" />
                <a
                  href={`tel:${content.footer.contact.phone.replace(/\s+/g, '')}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
                >
                  {content.footer.contact.phone}
                </a>
              </div>
            </div>
          </motion.div>
        </div>



        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <p className="text-gray-600 font-medium">{content.footer.copyright}</p>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
