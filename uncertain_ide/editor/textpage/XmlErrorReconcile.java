package editor.textpage;

import helpers.AuroraResourceUtil;
import helpers.DialogUtil;
import helpers.ExceptionUtil;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

import org.eclipse.jface.text.BadLocationException;
import org.eclipse.jface.text.Position;
import org.eclipse.jface.text.source.Annotation;
import org.eclipse.jface.text.source.AnnotationModel;
import org.eclipse.jface.text.source.IAnnotationModel;
import org.eclipse.jface.text.source.ISourceViewer;
import org.xml.sax.SAXException;
import org.xml.sax.SAXParseException;

public class XmlErrorReconcile implements IReconcileListener{
	public static final String AnnotationType = "aurora.ide.text.valid";
	private List xmlErrorAnnotatioList = new LinkedList();
	private IAnnotationModel xmlErrorAnnotationModel;
	private ISourceViewer sourceViewer;
	
	/**
	 * @param sourceViewer
	 */
	public XmlErrorReconcile(ISourceViewer sourceViewer) {
		super();
		this.sourceViewer = sourceViewer;
	}
	public void reconcile() {
		xmlErrorAnnotationModel = getAnnotationModel();
		clearHistory();
		try {
			AuroraResourceUtil.getCompsiteLoader().loadFromString(
					sourceViewer.getDocument().get(), "UTF-8");
		} catch (IOException e) {
			DialogUtil.showExceptionMessageBox(e);
		} catch (SAXException e) {
			updateAnnotation(e);
		}
		
	}
	private IAnnotationModel getAnnotationModel() {
		if (xmlErrorAnnotationModel != null)
			return xmlErrorAnnotationModel;
		xmlErrorAnnotationModel = sourceViewer.getAnnotationModel();
		if (xmlErrorAnnotationModel == null) {
			xmlErrorAnnotationModel = new AnnotationModel();
			xmlErrorAnnotationModel.connect(sourceViewer.getDocument());
		}
		return xmlErrorAnnotationModel;
	}

	private void clearHistory() {
		for (Iterator it = xmlErrorAnnotatioList.iterator(); it.hasNext();) {
			xmlErrorAnnotationModel.removeAnnotation((Annotation) it.next());
		}
		xmlErrorAnnotatioList.clear();
	}
	private void updateAnnotation(SAXException e) {
		Throwable rootCause = ExceptionUtil.getRootCause(e);
		if (rootCause == null || !(rootCause instanceof SAXParseException))
			return;
		SAXParseException parseEx = (SAXParseException) e;
		String errorMessage = ExceptionUtil.getExceptionTraceMessage(e);
		int lineNum = parseEx.getLineNumber() - 1;
		int lineOffset = getOffsetFromLine(lineNum);
		int lineLength = Math.max(getLengthOfLine(lineNum), 1);
		Position pos = new Position(lineOffset, lineLength);
		Annotation annotation = new Annotation(AnnotationType, false,
				errorMessage);
		xmlErrorAnnotationModel.addAnnotation(annotation, pos);
		xmlErrorAnnotatioList.add(annotation);
	}
	public int getOffsetFromLine(int lineNumber) {
		int offset = 0;
		if (lineNumber < 0)
			return offset;
		try {
			offset =sourceViewer.getDocument().getLineOffset(lineNumber);
			if (offset >= sourceViewer.getDocument().getLength())
				return getOffsetFromLine(lineNumber - 1);
		} catch (BadLocationException e) {
			return getOffsetFromLine(lineNumber - 1);
		}
		return offset;
	}
	public int getLengthOfLine(int lineNumber) {
		int length = 0;
		if (lineNumber < 0)
			return length;
		try {
			length = sourceViewer.getDocument().getLineLength(lineNumber);
		} catch (BadLocationException e) {
			try {
				length = sourceViewer.getDocument().getLineLength(lineNumber - 1);
			} catch (BadLocationException e1) {
			}
		}
		return length;
	}
}
