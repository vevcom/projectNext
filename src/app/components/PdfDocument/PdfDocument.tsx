'use client'
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import styles from './PdfDocument.module.scss';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type PropTypes = {
    src: string
}

/**
 * A component that displays a PDF document in a book format
 * @param src - The path (relative to domain) to the PDF document
 */
export default function PdfDocument({ src }: PropTypes) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<{
            leftPage: number | null,
            rightPage: number | null
        }>({
            leftPage: null,
            rightPage: null
        });
    const [pagePair, setPagePair] = useState<number>(1);

    const onDocumentLoadSuccess = ({ numPages } : { numPages: number }) => {
        setNumPages(numPages);
    }

    return (
        <div className={styles.PdfDocument}>
            <Document
                file={src}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <div className={styles.pages}>
                    <div className={styles.leftPage}>
                        {
                            pageNumber.leftPage && (
                                <Page key={pageNumber.leftPage} pageNumber={pageNumber.leftPage} />
                            )
                        }
                    </div>
                    <div className={styles.rightPage}>
                        {
                            pageNumber.rightPage && (
                                <Page key={pageNumber.rightPage} pageNumber={pageNumber.rightPage} />
                            )
                        }
                    </div>
                </div>
            </Document>
            <p>
                Page {pageNumber.leftPage}, {pageNumber.rightPage} of {numPages}
            </p>
            <button
                disabled={!pageNumber.leftPage || pageNumber.leftPage <= 1}
                onClick={() => setPagePair(pagePair - 1)}
            >
                Previous
            </button>
            <button
                disabled={!pageNumber.leftPage || pageNumber.leftPage <= 1}
                onClick={() => setPagePair(pagePair + 1)}
            >
                Next
            </button>
        </div>
    )
}