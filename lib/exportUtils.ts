import jsPDF from "jspdf";
import { saveAs } from "file-saver";

export function exportToPDF(html: string, filename: string = "resume.pdf") {
  // Create a temporary div to render HTML
  const tempDiv = document.createElement("div");
  
  // Add styling to the div
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "816px"; // A4 width in pixels at 96 DPI
  tempDiv.style.padding = "96px";
  tempDiv.style.fontFamily = "Arial, sans-serif";
  tempDiv.style.fontSize = "11pt";
  tempDiv.style.lineHeight = "1.5";
  tempDiv.style.color = "#000";
  tempDiv.style.backgroundColor = "#fff";
  
  // Set the HTML content
  tempDiv.innerHTML = html;
  
  // Append to body so it can be rendered
  document.body.appendChild(tempDiv);

  // Ensure all links have proper href attributes and are clickable
  const links = tempDiv.querySelectorAll("a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) {
      // Ensure email links have mailto: prefix
      if (href.includes("@") && !href.startsWith("mailto:") && !href.startsWith("http")) {
        link.setAttribute("href", `mailto:${href}`);
      }
      // Ensure other links have proper protocol
      else if (!href.startsWith("http") && !href.startsWith("mailto:")) {
        link.setAttribute("href", `https://${href}`);
      }
      // Ensure links open in new tab
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  // Create PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Convert HTML to PDF (simplified approach)
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Wait a bit for content to render, then convert to PDF
  setTimeout(() => {
    // Use html method with options - this preserves links in PDF
    pdf.html(tempDiv, {
      callback: (doc) => {
        doc.save(filename);
        document.body.removeChild(tempDiv);
      },
      x: 10,
      y: 10,
      width: pdfWidth - 20,
      windowWidth: 816,
      html2canvas: {
        useCORS: true,
        scale: 2,
        logging: false,
      },
    });
  }, 100);
}

export async function exportToDOCX(html: string, filename: string = "resume.docx") {
  try {
    // Extract body content if full HTML document is passed
    let bodyContent = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      bodyContent = bodyMatch[1];
    }
    
    // Clean up ProseMirror-specific classes and attributes
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = bodyContent;
    
    // Remove ProseMirror-specific classes
    const proseMirrorElements = tempDiv.querySelectorAll("[class*='ProseMirror']");
    proseMirrorElements.forEach(el => {
      el.removeAttribute("class");
    });
    
    // Clean body content
    bodyContent = tempDiv.innerHTML;
    
    // Dynamic import to avoid SSR issues
    const htmlDocxJs = await import("html-docx-js/dist/html-docx.js");
    
    // Create a proper HTML document for DOCX
    const docxHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `;
    
    // Convert HTML to DOCX
    const converted = htmlDocxJs.asBlob(docxHtml, {
      orientation: "portrait",
      margins: {
        top: 1440,
        right: 1440,
        bottom: 1440,
        left: 1440,
      },
    });

    saveAs(converted, filename);
  } catch (error) {
    console.error("Error exporting to DOCX:", error);
    // Fallback: Create a simple text document
    const blob = new Blob([html], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    saveAs(blob, filename);
  }
}

