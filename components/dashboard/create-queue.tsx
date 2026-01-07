/* eslint-disable react/no-children-prop */
"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "../ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { startTransition, useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Doc } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { createQueueAction } from "@/actions/queues";
import { createQueueFormSchema } from "@/shared/schemas";
import { useForm } from "@tanstack/react-form";

export function CreateQueueModal({
	businesses,
}: {
	businesses: Doc<"businesses">[];
}) {
	const [state, formAction, pending] = useActionState(createQueueAction, {
		queueId: null,
		error: null,
	});
	const [open, setOpen] = useState(false);

	const queueForm = useForm({
		defaultValues: {
			title: "",
			description: "",
			averageWaitTime: 0,
			maxCapacity: 0,
			isActive: true,
			isByInviteOnly: false,
			businessId: "",
		},
		onSubmit: ({ value }) => {
			console.log("Submitting form with values:", value);
			startTransition(() => formAction(value));

			if (state.queueId) {
				queueForm.reset();
				setOpen(false);
			}
		},
		onSubmitInvalid: ({ value, formApi }) => {
			console.log("Form submission failed with errors:", value);
			formApi.state.isSubmitting = false;
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="default">
					<PlusIcon className="mr-2 h-4 w-4" />
					Create
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-106.25">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						queueForm.handleSubmit();
					}}
				>
					<DialogHeader className="mb-4">
						<DialogTitle>Create new queue</DialogTitle>
						<DialogDescription>
							{pending
								? "Please wait while we create your queue."
								: state.error
								? `Error: ${state.error}`
								: state.queueId
								? "Queue created successfully!"
								: "Fill out the form below to create a new queue."}
						</DialogDescription>
					</DialogHeader>
					<FieldGroup className="grid gap-4 mb-3">
						<queueForm.Field
							name="title"
							validators={{
								onChangeAsync: async ({ value, fieldApi }) => {
									const errors =
										fieldApi.parseValueWithSchema(
											createQueueFormSchema.shape.title
										);
									return errors;
								},
							}}
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid;
								return (
									<Field className="grid gap-3">
										<FieldLabel htmlFor={field.name}>
											Title
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value
												)
											}
											placeholder="What is the queue for?"
										/>
										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						/>
						<queueForm.Field
							name="description"
							validators={{
								onChangeAsync: async ({ value, fieldApi }) => {
									const errors =
										fieldApi.parseValueWithSchema(
											createQueueFormSchema.shape
												.description
										);
									return errors;
								},
							}}
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid;
								return (
									<Field
										data-invalid={isInvalid}
										className="grid gap-3"
									>
										<FieldLabel htmlFor={field.name}>
											Description
										</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) =>
													field.handleChange(
														e.target.value
													)
												}
												placeholder="What is the queue about?"
												rows={6}
												className="min-h-24 resize-none"
												aria-invalid={isInvalid}
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.state.value.length}
													/500 characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						/>
						<queueForm.Field
							name="averageWaitTime"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid;
								return (
									<Field
										data-invalid={isInvalid}
										className="grid gap-3"
									>
										<FieldLabel htmlFor={field.name}>
											Average Wait Time{" "}
											<span className="text-xs">
												(minutes/person)
											</span>
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											type="number"
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													parseInt(e.target.value, 10)
												)
											}
											placeholder="What is the average wait time?"
										/>
										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						/>
						<queueForm.Field
							name="maxCapacity"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!field.state.meta.isValid;
								return (
									<Field
										data-invalid={isInvalid}
										className="grid gap-3"
									>
										<FieldLabel htmlFor={field.name}>
											Max Capacity
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											type="number"
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													parseInt(e.target.value, 10)
												)
											}
											placeholder="What is the max capacity?"
										/>
										{isInvalid && (
											<FieldError
												errors={field.state.meta.errors}
											/>
										)}
									</Field>
								);
							}}
						/>
						<div className="grid grid-cols-2 gap-3">
							<queueForm.Field
								name="isActive"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<div className="flex items-start gap-3">
												<Checkbox
													id={field.name}
													name={field.name}
													onBlur={field.handleBlur}
													checked={field.state.value}
													onCheckedChange={(c) =>
														field.handleChange(
															c === true
														)
													}
												/>
												<FieldLabel
													htmlFor={field.name}
												>
													Is Active
												</FieldLabel>
											</div>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							/>
							<queueForm.Field
								name="isByInviteOnly"
								children={(field) => {
									const isInvalid =
										field.state.meta.isTouched &&
										!field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<div className="flex items-start gap-3">
												<Checkbox
													id={field.name}
													name={field.name}
													onBlur={field.handleBlur}
													checked={field.state.value}
													onCheckedChange={(c) =>
														field.handleChange(
															c === true
														)
													}
												/>
												<FieldLabel
													htmlFor={field.name}
												>
													Is By Invite Only
												</FieldLabel>
											</div>
											{isInvalid && (
												<FieldError
													errors={
														field.state.meta.errors
													}
												/>
											)}
										</Field>
									);
								}}
							/>
						</div>
						{businesses.length > 0 && (
							<queueForm.Field
								name="businessId"
								children={(field) => (
									<Field className="grid gap-3">
										<Label htmlFor={field.name}>
											Link to Business
										</Label>
										<Select
											name={field.name}
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(value)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a business" />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													<SelectLabel>
														Businesses
													</SelectLabel>
													{businesses.map(
														(business) => (
															<SelectItem
																key={
																	business._id
																}
																value={
																	business._id
																}
															>
																{business.name}
															</SelectItem>
														)
													)}
												</SelectGroup>
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
						)}
					</FieldGroup>
					<DialogFooter>
						<DialogClose asChild>
							<Button
								onClick={() => {
									queueForm.reset();
									setOpen(false);
								}}
								variant="outline"
							>
								Cancel
							</Button>
						</DialogClose>
						<queueForm.Subscribe
							selector={(state) => [
								state.canSubmit,
								state.isSubmitting,
							]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									className="cursor-pointer"
									type="submit"
									disabled={!canSubmit}
								>
									{isSubmitting ? <Spinner /> : "Submit"}
								</Button>
							)}
						/>
						{/* <Button
							disabled={pending}
							className="cursor-pointer"
							type="submit"
						>
							{pending ? (
								<span>
									<Spinner /> Creating...
								</span>
							) : (
								"Create Queue"
							)}
						</Button> */}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
