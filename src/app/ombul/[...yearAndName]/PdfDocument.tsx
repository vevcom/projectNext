'use client'
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PropTypes = {
    src: string
}

export default function PdfDocument({ src }: PropTypes) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages } : { numPages: number }) => {
        setNumPages(numPages);
    }

    return (
        <div>
        <Document
            file={src}
            onLoadSuccess={onDocumentLoadSuccess}
        >
            <div className={styles.left}>
                <Page key={1} pageNumber={1} />
            </div>
        </Document>
        <p>
            Page {pageNumber} of {numPages}
        </p>
        <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prevPageNumber) => prevPageNumber - 2)}
        >
            Previous
        </button>
        <button
            disabled={!numPages || pageNumber >= numPages}
            onClick={() => setPageNumber((prevPageNumber) => prevPageNumber + 2)}
        >
            Next
        </button>
        </div>
    );
}