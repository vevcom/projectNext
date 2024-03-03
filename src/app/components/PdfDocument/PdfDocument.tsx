'use client'
import { 
    useEffect, 
    useState,
    useRef
} from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import styles from './PdfDocument.module.scss';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import useViewPort from '@/hooks/useViewPort';

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
    const [currentPages, setCurrentPages] = useState<{
            leftPage: number | null,
            rightPage: number | null
        }>({
            leftPage: null,
            rightPage: null
        });
    const [pagePair, setPagePair] = useState<number>(0)
    const [pageWidthLeft, setPageWidthLeft] = useState<number | null>(null)
    const [pageWidthRight, setPageWidthRight] = useState<number | null>(null)
    const leftPageRef = useRef<HTMLDivElement>(null)
    const rightPageRef = useRef<HTMLDivElement>(null)

    const onDocumentLoadSuccess = ({ numPages } : { numPages: number }) => {
        setNumPages(numPages);
    }

    useEffect(() => {
        if (!numPages) return 
        if (pagePair < 0) setPagePair(1)
        if (pagePair === 0) return setCurrentPages({
            leftPage: null,
            rightPage: numPages > 0 ? 1 : null
        })
        if (2*pagePair === numPages) return setCurrentPages({
            leftPage: numPages,
            rightPage: null
        })
        return setCurrentPages({
            leftPage: 2*pagePair,
            rightPage: 2*pagePair + 1
        })
    }, [numPages, pagePair])

    useViewPort(() => {
        if (leftPageRef.current) setPageWidthLeft(leftPageRef.current.offsetWidth)
        if (rightPageRef.current) setPageWidthRight(rightPageRef.current.offsetWidth)
    })

    const getPageNumberText = (rightPage: number | null, leftPage: number | null) => {
        if (rightPage && leftPage) return `Side ${leftPage} og ${rightPage} av ${numPages}`
        if (leftPage) return `Side ${leftPage} av ${numPages}`
        if (rightPage) return `Side ${rightPage} av ${numPages}`
        return ''
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
                            currentPages.leftPage && (
                                <button
                                    onClick={() => setPagePair(pagePair - 1)}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            )
                        }
                        <div ref={leftPageRef} className={styles.page}>
                        {
                            currentPages.leftPage && (
                                <Page 
                                    width={pageWidthLeft || undefined}
                                    key={currentPages.leftPage} 
                                    pageNumber={currentPages.leftPage} 
                                />
                            )
                        }
                        </div>
                    </div>
                    <div className={styles.rightPage}>
                        <div ref={rightPageRef} className={styles.page}>
                        {
                            currentPages.rightPage && (
                                <Page 
                                    width={pageWidthRight || undefined}
                                    key={currentPages.rightPage} 
                                    pageNumber={currentPages.rightPage} 
                                />
                            )
                        }
                        </div>
                        {
                            currentPages.rightPage && (
                                <button
                                    onClick={() => setPagePair(pagePair + 1)}
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            )
                        }
                    </div>
                </div>
            </Document>
            <p>
                {getPageNumberText(currentPages.rightPage, currentPages.leftPage)}
            </p>
        </div>
    )
}