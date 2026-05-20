import { motion } from 'framer-motion';
import { teamMembers } from '../data/products';
import { Heart, Landmark, Sparkles, Feather } from 'lucide-react';

const About = () => {
  return (
    <div className="page-wrapper pt-24 bg-white">
      {/* Hero Header */}
      <div className="bg-[#E8E0F0] py-12 lg:py-16 px-6 text-center">
        <span className="section-subtitle text-[#9B7EC8]">OUR STORY</span>
        <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] mt-3 mb-4 md:mb-6">
          About Coco
        </h1>
        <div className="divider mx-auto" />
        <p className="text-sm font-inter text-gray-600 max-w-xl mx-auto leading-relaxed">
          Crafting minimalist luxury wear designed for comfort, style, and absolute premium quality.
        </p>
      </div>

      {/* Main Narrative */}
      <section className="section-padding container-fluid">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6 order-2 lg:order-1"
          >
            <span className="section-subtitle">Since 2018</span>
            <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl font-bold text-[#0A0A0A] leading-tight">
              Redefining Couture with <br />
              <em className="text-[#9B7EC8]">Elegant Simplicity</em>
            </h2>
            <p className="text-sm font-inter text-[#6B6B6B] leading-relaxed">
              Coco was born out of a desire to create clothing and accessories that are luxury to the touch,
              yet completely understated. We believe that true sophistication lies in the quality of the materials,
              the precision of the stitch, and the elegance of the silhouette.
            </p>
            <p className="text-sm font-inter text-[#6B6B6B] leading-relaxed">
              Every single product we design goes through multiple iterations in our design studios, selecting only
              the finest French laces, Egyptian cottons, and premium steel dials for our watches. We work close with artisan
              communities to bring you items that are as durable as they are beautiful.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="aspect-[4/3] bg-gray-100 overflow-hidden shadow-xl order-1 lg:order-2"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop"
              alt="Tailoring"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="section-padding bg-[#FAFAFA]">
        <div className="container-fluid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Sparkles,
                title: 'Exceptional Quality',
                desc: 'We procure only premium materials and fabrics to make sure every item has a luxurious drape and feeling.'
              },
              {
                icon: Feather,
                title: 'Minimalist Aesthetic',
                desc: 'Our designs avoid loud logos, opting instead for elegant simplicity and precise lines.'
              },
              {
                icon: Heart,
                title: 'Artisan Crafted',
                desc: 'Supporting local craftsmen, each piece is assembled with traditional care combined with modern tools.'
              }
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm text-center">
                <div className="w-12 h-12 bg-[#E8E0F0] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-[#9B7EC8] shrink-0">
                  <Icon size={20} />
                </div>
                <h3 className="font-playfair text-lg font-semibold mb-3">{title}</h3>
                <p className="text-xs text-gray-500 font-inter leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding container-fluid">
        <div className="text-center mb-12 lg:mb-16">
          <span className="section-subtitle">CREATIVE MINDS</span>
          <div className="divider mx-auto" />
          <h2 className="section-title">Meet Our <em className="text-[#9B7EC8]">Directors</em></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group text-center"
            >
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden mb-4 md:mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-playfair text-lg md:text-xl font-bold">{member.name}</h3>
              <p className="text-xs text-[#9B7EC8] tracking-[2px] uppercase font-inter mt-1 mb-3">{member.role}</p>
              <p className="text-xs text-gray-500 font-inter px-4 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
