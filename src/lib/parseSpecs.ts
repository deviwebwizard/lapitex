export interface Specification {
  key: string;
  value: string;
}

export function parseSpecs(name: string, description: string, category: string): Specification[] {
  const specs: Specification[] = [];
  const textToSearch = `${name} ${description}`.toLowerCase();

  // Common specifications
  specs.push({ key: "Condition", value: textToSearch.includes('new') && !textToSearch.includes('refurbished') ? "New" : "Refurbished" });
  specs.push({ key: "Warranty", value: textToSearch.includes('1 year') ? "1 Year" : "6 Months" });

  if (category.toLowerCase().includes('laptop') || category.toLowerCase().includes('desktop')) {
    // Processor
    if (textToSearch.includes('i7')) specs.push({ key: "Processor", value: "Intel Core i7" });
    else if (textToSearch.includes('i5')) specs.push({ key: "Processor", value: "Intel Core i5" });
    else if (textToSearch.includes('i3')) specs.push({ key: "Processor", value: "Intel Core i3" });
    else if (textToSearch.includes('ryzen 7')) specs.push({ key: "Processor", value: "AMD Ryzen 7" });
    else if (textToSearch.includes('ryzen 5')) specs.push({ key: "Processor", value: "AMD Ryzen 5" });
    else specs.push({ key: "Processor", value: "Standard Processor" });

    // RAM
    if (textToSearch.includes('32gb')) specs.push({ key: "RAM", value: "32GB DDR4" });
    else if (textToSearch.includes('16gb')) specs.push({ key: "RAM", value: "16GB DDR4" });
    else if (textToSearch.includes('8gb')) specs.push({ key: "RAM", value: "8GB DDR4" });
    else specs.push({ key: "RAM", value: "8GB (Default)" });

    // Storage
    if (textToSearch.includes('1tb')) specs.push({ key: "Storage", value: "1TB SSD" });
    else if (textToSearch.includes('512gb')) specs.push({ key: "Storage", value: "512GB SSD" });
    else if (textToSearch.includes('256gb')) specs.push({ key: "Storage", value: "256GB SSD" });
    else specs.push({ key: "Storage", value: "256GB SSD" });

    // Display
    if (category.toLowerCase().includes('laptop')) {
      if (textToSearch.includes('15.6')) specs.push({ key: "Display Size", value: "15.6 Inches" });
      else if (textToSearch.includes('14')) specs.push({ key: "Display Size", value: "14 Inches" });
      else if (textToSearch.includes('13.3')) specs.push({ key: "Display Size", value: "13.3 Inches" });
      else specs.push({ key: "Display", value: "Standard HD/FHD" });
    }

    // OS
    if (textToSearch.includes('windows 11')) specs.push({ key: "Operating System", value: "Windows 11" });
    else if (textToSearch.includes('windows 10')) specs.push({ key: "Operating System", value: "Windows 10 Pro" });
    else specs.push({ key: "Operating System", value: "Windows 10/11 Compatible" });
  } 
  else if (category.toLowerCase().includes('ram')) {
    if (textToSearch.includes('32gb')) specs.push({ key: "Capacity", value: "32GB" });
    else if (textToSearch.includes('16gb')) specs.push({ key: "Capacity", value: "16GB" });
    else if (textToSearch.includes('8gb')) specs.push({ key: "Capacity", value: "8GB" });
    
    if (textToSearch.includes('ddr5')) specs.push({ key: "Type", value: "DDR5" });
    else specs.push({ key: "Type", value: "DDR4" });
  }
  else if (category.toLowerCase().includes('ssd')) {
    if (textToSearch.includes('1tb')) specs.push({ key: "Capacity", value: "1TB" });
    else if (textToSearch.includes('512gb')) specs.push({ key: "Capacity", value: "512GB" });
    else if (textToSearch.includes('256gb')) specs.push({ key: "Capacity", value: "256GB" });
    
    if (textToSearch.includes('nvme')) specs.push({ key: "Interface", value: "NVMe PCIe" });
    else if (textToSearch.includes('sata')) specs.push({ key: "Interface", value: "SATA III" });
  }

  // Fallback if no specs matched
  if (specs.length <= 2) {
    specs.push({ key: "Brand", value: textToSearch.includes('dell') ? "Dell" : textToSearch.includes('hp') ? "HP" : textToSearch.includes('lenovo') ? "Lenovo" : "Generic" });
    specs.push({ key: "Quality", value: "Premium Checked" });
    specs.push({ key: "Compatibility", value: "Universal" });
  }

  return specs;
}
