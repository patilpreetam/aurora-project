package aurora.ide.meta.gef.editors.wizard.dialog;

import java.util.ArrayList;
import java.util.Map;

import org.eclipse.jface.resource.ImageRegistry;
import org.eclipse.swt.SWT;
import org.eclipse.swt.custom.CLabel;
import org.eclipse.swt.custom.SashForm;
import org.eclipse.swt.custom.ScrolledComposite;
import org.eclipse.swt.events.MouseAdapter;
import org.eclipse.swt.events.MouseEvent;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.events.SelectionListener;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Control;
import org.eclipse.swt.widgets.Event;
import org.eclipse.swt.widgets.List;
import org.eclipse.swt.widgets.TypedListener;

import aurora.ide.meta.MetaPlugin;
import aurora.ide.meta.gef.editors.template.Template;

public class TComposite extends SashForm {

	private ImageRegistry images = MetaPlugin.getDefault().getImageRegistry();
	private java.util.List<CLabel> labels = new ArrayList<CLabel>();
	private Template template = null;
	private int labelHeight = 100;
	private int labelWidth = 120;

	private Composite composite;
	private List list;

	public TComposite(Composite parent, int style, final Map<String, java.util.List<Template>> templates) {
		super(parent, style);
		this.setLayout(new GridLayout(2, false));

		list = new List(this, SWT.NONE);
		list.setLayoutData(new GridData(GridData.FILL_VERTICAL));
		list.setBackground(getShell().getDisplay().getSystemColor(SWT.COLOR_WHITE));

		final ScrolledComposite scrolledComposite = new ScrolledComposite(this, SWT.V_SCROLL | SWT.H_SCROLL);
		scrolledComposite.setLayoutData(new GridData(GridData.FILL_BOTH));
		composite = new Composite(scrolledComposite, SWT.NONE);
		composite.setLayout(new GridLayout(3, true));
		composite.setBackground(getShell().getDisplay().getSystemColor(SWT.COLOR_WHITE));

		this.setWeights(new int[] { 20, 80 });
		this.setSashWidth(1);

		scrolledComposite.setContent(composite);
		scrolledComposite.setExpandHorizontal(true);
		scrolledComposite.setExpandVertical(true);
		int x = (int) Math.ceil(templates.size() / 3.0);
		scrolledComposite.setMinWidth(labelWidth * 3 + 20);
		scrolledComposite.setMinHeight(x * labelHeight + x * 5 + 5);

		for (String key : templates.keySet()) {
			list.add(key);
		}

		list.addSelectionListener(new SelectionAdapter() {
			public void widgetSelected(SelectionEvent e) {
				createList(templates);
				notifyListeners(SWT.Selection, new Event());
			}

		});
		if (list.getItems().length > 0) {
			list.select(0);
			createList(templates);
		}
	}

	private void createList(final Map<String, java.util.List<Template>> templates) {
		java.util.List<Template> tm = templates.get(list.getSelection()[0]);
		for (Control c : composite.getChildren()) {
			if (c != null && !c.isDisposed()) {
				c.dispose();
			}
		}
		labels.clear();
		for (Template t : tm) {
			labels.add(createLabel(t));
		}
		template = (Template) labels.get(0).getData();
		setLabelChecked(labels.get(0), true);
		composite.layout(true);
	}

	private CLabel createLabel(Template t) {
		CLabel label = new CLabel(composite, SWT.CENTER);
		label.setCursor(getShell().getDisplay().getSystemCursor(SWT.CURSOR_HAND));
		label.setBackground(getShell().getDisplay().getSystemColor(SWT.COLOR_WHITE));
		label.setData(t);
		GridData gd = new GridData();
		gd.heightHint = labelHeight;
		gd.widthHint = labelWidth;
		label.setLayoutData(gd);
		//label.setText(t.getName());
		label.setImage(getImage(t.getIcon()));
		label.addMouseListener(new MouseAdapter() {
			public void mouseDown(MouseEvent e) {
				CLabel lbl = (CLabel) e.getSource();
				setLabelChecked(lbl, true);
				template = (Template) lbl.getData();
				notifyListeners(SWT.Selection, new Event());
				for (int i = 0; i < labels.size(); i++) {
					if (labels.get(i) != lbl) {
						setLabelChecked(labels.get(i), false);
					}
				}
			}
		});
		return label;
	}

	public void addSelectionListener(SelectionListener listener) {
		checkWidget();
		if (listener == null) {
			SWT.error(SWT.ERROR_NULL_ARGUMENT);
		}
		TypedListener typedListener = new TypedListener(listener);
		addListener(SWT.Selection, typedListener);
		addListener(SWT.DefaultSelection, typedListener);
	}

	public Template getSelection() {
		return template;
	}

	private void setLabelChecked(CLabel label, boolean chencked) {
		if (chencked) {
			label.setBackground(getShell().getDisplay().getSystemColor(SWT.COLOR_TITLE_INACTIVE_BACKGROUND_GRADIENT));
		} else {
			label.setBackground(getShell().getDisplay().getSystemColor(SWT.COLOR_WHITE));
		}
	}

	private Image getImage(String path) {
		if (images.get(path) == null) {
			Image image = new Image(getDisplay(), path);
			images.put(path, image);
		}
		return images.get(path);
	}
}