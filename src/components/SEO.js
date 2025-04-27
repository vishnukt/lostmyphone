import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component for managing page-specific meta data
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonicalUrl - Canonical URL for the page
 * @param {string} props.type - Open Graph type (website, article, etc.)
 * @param {Object} props.image - Open Graph image details
 * @param {string} props.image.url - Open Graph image URL
 * @param {number} props.image.width - Open Graph image width
 * @param {number} props.image.height - Open Graph image height
 * @param {string} props.image.alt - Open Graph image alternative text
 */
const SEO = ({
  title = 'LostMyPhone - Emergency Contact Access',
  description = 'Never lose your important contacts again. Access your emergency contacts when you need them most.',
  canonicalUrl = '',
  type = 'website',
  image = {
    url: `${window.location.origin}/og-image.png`,
    width: 1200,
    height: 630,
    alt: 'LostMyPhone - Emergency Contact Access',
  },
}) => {
  const siteUrl = window.location.origin;
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : window.location.href;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.url} />
      {image.width && <meta property="og:image:width" content={image.width.toString()} />}
      {image.height && <meta property="og:image:height" content={image.height.toString()} />}
      {image.alt && <meta property="og:image:alt" content={image.alt} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.url} />
      {image.alt && <meta name="twitter:image:alt" content={image.alt} />}
      
      {/* Additional structured data can be added here */}
    </Helmet>
  );
};

export default SEO; 